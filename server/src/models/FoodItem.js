const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  servingSize: {
    value: Number,
    unit: {
      type: String,
      default: 'g'
    }
  },
  nutrients: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true }, // in grams
    carbs: { type: Number, required: true },   // in grams
    fats: { type: Number, required: true },    // in grams
    fiber: Number,
    iron: Number,        // mg
    calcium: Number,     // mg
    vitaminB12: Number,  // mcg
    vitaminD: Number,    // mcg
    zinc: Number,        // mg
    omega3: Number       // g
  },
  tags: [String],
  isCommon: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
