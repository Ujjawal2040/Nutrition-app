const NutritionLog = require('../models/NutritionLog');
const User = require('../models/User');

exports.getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const logs = await NutritionLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const stats = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const log = logs.find(l => {
        const logDateStr = l.date.toISOString().split('T')[0];
        return logDateStr === dateStr;
      });
      
      stats.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateStr,
        calories: log ? log.dailySummary.totalCalories : 0,
        burned: log ? log.dailySummary.totalCaloriesBurned : 0
      });
    }

    res.status(200).json({ status: 'success', data: { stats } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateGroceryList = async (req, res) => {
  try {
    const { items } = req.body;
    const user = await User.findById(req.user._id);
    user.groceryList = items;
    await user.save();
    res.status(200).json({ status: 'success', data: { groceryList: user.groceryList } });
  } catch (error) {
    console.error('updateGroceryList Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { type, id } = req.body; 
    const user = await User.findById(req.user._id);

    if (!user.favorites[type]) {
      user.favorites[type] = [];
    }

    const index = user.favorites[type].findIndex(item => item.toString() === id.toString());
    
    if (index === -1) {
      user.favorites[type].push(id);
    } else {
      user.favorites[type].splice(index, 1);
    }

    await user.save();
    res.status(200).json({ status: 'success', data: { favorites: user.favorites } });
  } catch (error) {
    console.error('toggleFavorite Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
