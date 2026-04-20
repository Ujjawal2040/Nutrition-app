const NutritionLog = require('../models/NutritionLog');
const FoodItem = require('../models/FoodItem');

exports.logFood = async (req, res) => {
  try {
    const { foodId, quantity, mealType, date } = req.body;
    const userId = req.user._id;

    let nutrients;
    let foodName = "";

    if (foodId === 'custom' || String(foodId).startsWith('ai-temp')) {
      // AI / Custom log
      nutrients = req.body.nutrients;
      foodName = req.body.foodName || "Custom Item";
    } else {
      const food = await FoodItem.findById(foodId);
      if (!food) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      const ratio = quantity / (food.servingSize.value || 100);
      nutrients = {
        calories: Math.round(food.nutrients.calories * ratio),
        protein: Math.round(food.nutrients.protein * ratio),
        carbs: Math.round(food.nutrients.carbs * ratio),
        fats: Math.round(food.nutrients.fats * ratio),
      };
      foodName = food.name;
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    let log = await NutritionLog.findOne({ userId, date: logDate });

    if (!log) {
      log = new NutritionLog({ 
        userId, 
        date: logDate, 
        meals: [],
        activities: [],
        dailySummary: {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          waterIntake: 0,
          totalCaloriesBurned: 0,
          netCalories: 0
        }
      });
    }

    log.meals.push({ foodId, mealType, quantity, nutrients });
    await log.save();

    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) {
    console.error('logFood Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getDailyLog = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;
    const logDate = new Date(date || new Date());
    logDate.setHours(0, 0, 0, 0);

    const log = await NutritionLog.findOne({ userId, date: logDate }).populate('meals.foodId').populate('activities.activityId');
    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.searchFood = async (req, res) => {
  try {
    const { q } = req.query;
    const foods = await FoodItem.find({
      name: { $regex: q, $options: 'i' }
    }).limit(20);

    res.status(200).json({ status: 'success', results: foods.length, data: { foods } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.logWater = async (req, res) => {
  try {
    const { amount, date } = req.body;
    const userId = req.user._id;
    const logDate = new Date(date || new Date());
    logDate.setHours(0, 0, 0, 0);

    let log = await NutritionLog.findOne({ userId, date: logDate });
    if (!log) {
      log = new NutritionLog({ 
        userId, 
        date: logDate, 
        meals: [],
        activities: [],
        dailySummary: {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          waterIntake: 0,
          totalCaloriesBurned: 0,
          netCalories: 0
        }
      });
    }

    log.dailySummary.waterIntake += Number(amount);
    await log.save();

    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) {
    console.error('logWater Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
