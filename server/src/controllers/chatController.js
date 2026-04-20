const Groq = require('groq-sdk');
const NutritionLog = require('../models/NutritionLog');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getSystemPrompt = (user, logs) => {
  const name = user.name.split(' ')[0];
  const metrics = user.profile;
  const goals = user.goals;
  const recentLog = logs[0] || {};
  
  return `
    You are Protus AI, a premium human-like health and nutrition consultant.
    Your tone is empathetic, professional, and slightly futuristic.
    
    User Context:
    - Name: ${name}
    - Age: ${metrics.age}
    - Weight: ${metrics.weight}kg, Height: ${metrics.height}cm
    - Goal: ${user.profile.activityLevel} activity level with targets: ${goals.calories}kcal, ${goals.protein}g Protein.
    - Today's Consumed: ${recentLog.dailySummary?.totalCalories || 0}kcal.
    - Today's Burned: ${recentLog.dailySummary?.totalCaloriesBurned || 0}kcal.
    
    Guidelines:
    1. Reply in the language the user uses (Hindi or English).
    2. Provide personalized advice based on their specific metrics.
    3. If they upload an image (Vision), analyze the nutritional content of the food.
    4. Keep replies concise but high-value.
    5. Always be encouraging and science-based.
  `;
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Fetch user context for personalization
    const logs = await NutritionLog.find({ userId }).sort({ date: -1 }).limit(1);
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: getSystemPrompt(req.user, logs) },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    res.status(200).json({ 
      status: 'success', 
      reply: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Groq Chat Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.transcribe = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file provided' });

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-large-v3',
      prompt: 'The user is talking about health, nutrition, or exercise in Hindi or English.',
      response_format: 'verbose_json',
    });

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ 
      status: 'success', 
      text: transcription.text 
    });
  } catch (error) {
    console.error('Groq Transcribe Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.vision = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    // Convert image to base64 for Groq Vision
    const base64Image = fs.readFileSync(req.file.path, { encoding: 'base64' });
    const userId = req.user._id;
    const logs = await NutritionLog.find({ userId }).sort({ date: -1 }).limit(1);

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: getSystemPrompt(req.user, logs) },
        {
          role: 'user',
          content: [
            { type: 'text', text: "Analyze the nutritional content of this food image." },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    });

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ 
      status: 'success', 
      reply: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('Groq Vision Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getHealthGuide = async (req, res) => {
  try {
    const { topic } = req.body;
    const user = req.user;
    
    const systemPrompt = `You are a Senior Health Researcher for Protus. 
    Generate a detailed, evidence-based guide for the topic: "${topic}".
    Format the response using Markdown.
    Context: User is ${user.age} yrs, ${user.profile?.dietaryPreference || 'general'} diet.`;

    const response = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    res.status(200).json({ status: 'success', data: { guide: response.choices[0].message.content } });
  } catch (error) {
    console.error('Health Guide Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getWorkoutDeepDive = async (req, res) => {
  try {
    const { exercise } = req.body;
    const user = req.user;
    
    const systemPrompt = `You are a World-Class Fitness Trainer for Protus. 
    Provide a detailed guide for: "${exercise}".
    Respond in STRICT JSON format:
    {
      "steps": ["Step 1", "Step 2", ...],
      "muscles": ["Primary", "Secondary"],
      "difficulty": "Beginner/Intimate/Advanced",
      "proTips": ["Tip 1", "Tip 2"],
      "recommendedVolume": "e.g. 3 sets of 12"
    }
    Tailor difficulty to user weight: ${user.profile?.weight}kg.`;

    const response = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    res.status(200).json({ status: 'success', data: JSON.parse(response.choices[0].message.content) });
  } catch (error) {
    console.error('Workout Intelligence Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
