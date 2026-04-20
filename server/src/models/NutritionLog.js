const mongoose = require('mongoose');

const nutritionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  meals: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: false
    },
    foodName: String,
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    nutrients: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number
    }
  }],
  activities: [{
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    },
    activityName: String,
    duration: Number, // in minutes
    caloriesBurned: Number,
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate'
    }
  }],
  dailySummary: {
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
    totalCaloriesBurned: { type: Number, default: 0 },
    netCalories: { type: Number, default: 0 }
  }
});

// Calculate daily totals before saving
nutritionLogSchema.pre('save', function() {
  this.dailySummary.totalCalories = Math.round(this.meals.reduce((sum, item) => sum + (item.nutrients?.calories || 0), 0)) || 0;
  this.dailySummary.totalProtein = Math.round(this.meals.reduce((sum, item) => sum + (item.nutrients?.protein || 0), 0)) || 0;
  this.dailySummary.totalCarbs = Math.round(this.meals.reduce((sum, item) => sum + (item.nutrients?.carbs || 0), 0)) || 0;
  this.dailySummary.totalFats = Math.round(this.meals.reduce((sum, item) => sum + (item.nutrients?.fats || 0), 0)) || 0;
  
  this.dailySummary.totalCaloriesBurned = Math.round(this.activities.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0)) || 0;
  this.dailySummary.netCalories = (this.dailySummary.totalCalories || 0) - (this.dailySummary.totalCaloriesBurned || 0);
});



module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
