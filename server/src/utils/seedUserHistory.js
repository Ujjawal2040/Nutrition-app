const NutritionLog = require('../models/NutritionLog');

exports.seedHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0,0,0,0);

    const logs = [];
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Delete existing to avoid duplicates
      await NutritionLog.findOneAndDelete({ userId, date });

      const mockCalories = 1500 + Math.floor(Math.random() * 800);
      const mockBurned = 200 + Math.floor(Math.random() * 500);

      logs.push({
        userId,
        date,
        meals: [],
        activities: [],
        dailySummary: {
          totalCalories: mockCalories,
          totalProtein: Math.floor(mockCalories / 20),
          totalCarbs: Math.floor(mockCalories / 10),
          totalFats: Math.floor(mockCalories / 30),
          waterIntake: 2000 + Math.floor(Math.random() * 500),
          totalCaloriesBurned: mockBurned,
          netCalories: mockCalories - mockBurned
        }
      });
    }

    await NutritionLog.insertMany(logs);
    res.status(200).json({ status: 'success', message: '6 days of history seeded!' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
