const NutritionLog = require('../models/NutritionLog');

exports.seedHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0,0,0,0);

    const logs = [];
    for (let i = 0; i <= 6; i++) { // Include today
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Delete existing to avoid duplicates
      await NutritionLog.findOneAndDelete({ userId, date });

      // Create a pattern: some days over target, some under
      const baseCal = 1800;
      const flux = Math.floor(Math.random() * 800) - 300;
      const mockCalories = baseCal + flux;
      
      const mockBurned = 150 + Math.floor(Math.random() * 600);

      logs.push({
        userId,
        date,
        meals: [
          {
             foodName: 'Seeded Meal',
             mealType: 'lunch',
             quantity: 1,
             nutrients: { calories: mockCalories, protein: 50, carbs: 100, fats: 20 }
          }
        ],
        activities: [
          {
            activityName: 'Seeded Activity',
            duration: 30,
            caloriesBurned: mockBurned,
            intensity: 'moderate'
          }
        ],
        dailySummary: {
          totalCalories: mockCalories,
          totalProtein: Math.floor(mockCalories / 20),
          totalCarbs: Math.floor(mockCalories / 10),
          totalFats: Math.floor(mockCalories / 30),
          waterIntake: 2000 + Math.floor(Math.random() * 1000),
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
