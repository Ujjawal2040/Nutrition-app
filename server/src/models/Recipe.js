const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  ingredients: [{
    name: String,
    amount: String
  }],
  instructions: [String],
  image: String,
  prepTime: Number, // in minutes
  tags: [String],
  isPopular: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
