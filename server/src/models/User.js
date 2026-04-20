const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    weight: Number, // in kg
    height: Number, // in cm
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
      default: 'sedentary'
    },
    dietaryPreference: {
      type: String,
      enum: ['veg', 'non-veg', 'vegetarian', 'non-vegetarian'],
      default: 'veg'
    }
  },
  goals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  favorites: {
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    resources: [String] // IDs of resource articles
  },
  badges: [{
    name: String,
    icon: String, // lucide icon name
    dateEarned: { type: Date, default: Date.now },
    label: String
  }],
  groceryList: [{
    name: String,
    amount: String,
    checked: { type: Boolean, default: false }
  }],
  streaks: {
    current: { type: Number, default: 0 },
    lastLoggedDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
