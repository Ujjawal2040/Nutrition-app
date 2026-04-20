const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Cardio', 'Strength', 'Sports', 'Lifestyle', 'Flexibility'],
    required: true
  },
  metValue: {
    type: Number,
    required: true
  },
  description: String,
  intensityDescription: {
    low: String,
    moderate: String,
    high: String
  }
});

module.exports = mongoose.model('Activity', activitySchema);
