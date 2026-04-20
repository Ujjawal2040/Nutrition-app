const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { calculateTargets } = require('../utils/recommendationEngine');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Calculate initial goals based on profile
    const targets = calculateTargets(profile);

    const user = await User.create({
      name,
      email,
      password,
      profile,
      goals: targets.calories ? {
        calories: targets.calories,
        protein: targets.macros.protein,
        carbs: targets.macros.carbs,
        fats: targets.macros.fats
      } : undefined
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);
    user.password = undefined;

    // Update streaks
    const today = new Date();
    today.setHours(0,0,0,0);
    const lastLogged = user.streaks?.lastLoggedDate ? new Date(user.streaks.lastLoggedDate) : null;
    
    if (lastLogged) {
      lastLogged.setHours(0,0,0,0);
      const diffTime = Math.abs(today - lastLogged);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streaks.current += 1;
      } else if (diffDays > 1) {
        user.streaks.current = 1;
      }
    } else {
      user.streaks.current = 1;
    }
    user.streaks.lastLoggedDate = today;
    await user.save();

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    
    // Recalculate targets based on new profile
    const targets = calculateTargets(profile);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profile,
        goals: {
          calories: targets.calories,
          protein: targets.macros.protein,
          carbs: targets.macros.carbs,
          fats: targets.macros.fats
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
