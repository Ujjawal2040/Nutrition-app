const Activity = require('../models/Activity');
const NutritionLog = require('../models/NutritionLog');

exports.logActivity = async (req, res) => {
  try {
    const { activityId, duration, date, intensity } = req.body;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const weight = (req.user.profile && req.user.profile.weight) ? req.user.profile.weight : 70;
    const intensityMultiplier = intensity === 'high' ? 1.2 : intensity === 'low' ? 0.8 : 1.0;
    const caloriesBurned = Math.round((activity.metValue * intensityMultiplier * 3.5 * weight * Number(duration)) / 200);

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

    log.activities.push({
      activityId,
      activityName: activity.name,
      duration: Number(duration),
      caloriesBurned,
      intensity
    });

    await log.save();

    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) {
    console.error('logActivity Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { logId, activityIndex } = req.params;
    const log = await NutritionLog.findOne({ _id: logId, userId: req.user._id });

    if (!log) return res.status(404).json({ message: 'Log not found' });

    log.activities.splice(activityIndex, 1);
    await log.save();

    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const { q } = req.query;
    const activities = await Activity.find({
      name: { $regex: q || '', $options: 'i' }
    }).limit(20);

    res.status(200).json({ status: 'success', results: activities.length, data: { activities } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const log = await NutritionLog.findOne({ userId: req.user._id, date: today });
    res.status(200).json({ status: 'success', data: { activities: log ? log.activities : [], logId: log ? log._id : null } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
