const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('../models/FoodItem');
const Recipe = require('../models/Recipe');
const Activity = require('../models/Activity');

dotenv.config({ path: './.env' });

const foods = [
  {
    name: 'Steamed Spinach',
    category: 'veg',
    servingSize: { value: 100, unit: 'g' },
    nutrients: { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, iron: 2.7, calcium: 99, vitaminC: 28, zinc: 0.5 },
    tags: ['Superfood', 'Iron Rich', 'Low Calorie']
  },
  {
    name: 'Grilled Chicken Breast',
    category: 'non-veg',
    servingSize: { value: 100, unit: 'g' },
    nutrients: { calories: 165, protein: 31, carbs: 0, fats: 3.6, iron: 1.0, vitaminB12: 0.3, zinc: 1.0 },
    tags: ['High Protein', 'Lean Meat']
  },
  {
    name: 'Quinoa (Cooked)',
    category: 'veg',
    servingSize: { value: 100, unit: 'g' },
    nutrients: { calories: 120, protein: 4.4, carbs: 21, fats: 1.9, iron: 1.5, zinc: 1.1, fiber: 2.8 },
    tags: ['Complete Protein', 'Grain', 'Gluten Free']
  },
  {
    name: 'Paneer (Cottage Cheese)',
    category: 'veg',
    servingSize: { value: 100, unit: 'g' },
    nutrients: { calories: 265, protein: 18, carbs: 1.2, fats: 20, calcium: 480, vitaminB12: 0.5 },
    tags: ['Dairy', 'High Protein', 'Calcium Rich']
  },
  {
    name: 'Eggs (Hard Boiled)',
    category: 'non-veg',
    servingSize: { value: 50, unit: 'g' },
    nutrients: { calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3, iron: 0.6, vitaminB12: 0.6, vitaminD: 44 },
    tags: ['High Protein', 'Vitamin D']
  },
  {
    name: 'Lentils (Cooked)',
    category: 'veg',
    servingSize: { value: 100, unit: 'g' },
    nutrients: { calories: 116, protein: 9, carbs: 20, fats: 0.4, iron: 3.3, zinc: 1.3, fiber: 7.9 },
    tags: ['Legume', 'Iron Rich', 'Fiber Rich']
  }
];

const recipes = [
  {
    title: 'Protein-Packed Quinoa Salad',
    description: 'A refreshing and nutrient-dense salad perfect for lunch.',
    category: 'veg',
    nutrients: { calories: 350, protein: 12, carbs: 45, fats: 15 },
    ingredients: [
      { name: 'Quinoa', amount: '1 cup' },
      { name: 'Chickpeas', amount: '1/2 cup' },
      { name: 'Cucumber', amount: '1 medium' },
      { name: 'Lemon Dressing', amount: '2 tbsp' }
    ],
    instructions: ['Cook quinoa.', 'Chop vegetables.', 'Mix all ingredients with dressing.'],
    prepTime: 15,
    tags: ['High Protein', 'Light', 'Lunch'],
    isPopular: true
  },
  {
    title: 'Lemon Herb Grilled Chicken',
    description: 'Lean and flavorful chicken breast seasoned with fresh herbs.',
    category: 'non-veg',
    nutrients: { calories: 280, protein: 45, carbs: 5, fats: 8 },
    ingredients: [
      { name: 'Chicken Breast', amount: '200g' },
      { name: 'Lemon', amount: '1/2' },
      { name: 'Rosemary', amount: '1 sprig' },
      { name: 'Olive Oil', amount: '1 tsp' }
    ],
    instructions: ['Marinate chicken.', 'Grill for 15-20 mins.', 'Serve with lemon.'],
    prepTime: 25,
    tags: ['High Protein', 'Keto Friendly'],
    isPopular: true
  }
];

const activities = [
  { name: 'Brisk Walking', category: 'Cardio', metValue: 5.0, description: 'Walking at a pace of 3.5-4.0 mph.' },
  { name: 'Jogging', category: 'Cardio', metValue: 7.0, description: 'Running at a moderate pace (approx 5 mph).' },
  { name: 'Running', category: 'Cardio', metValue: 10.0, description: 'Running at a fast pace (approx 6 mph).' },
  { name: 'Swimming (Moderate)', category: 'Cardio', metValue: 8.0, description: 'Moderate-intensity swimming laps.' },
  { name: 'Weight Lifting (Free Weights)', category: 'Strength', metValue: 3.5, description: 'Standard resistance training.' },
  { name: 'Push-ups/Sit-ups', category: 'Strength', metValue: 3.8, description: 'Moderate-intensity calisthenics.' },
  { name: 'Yoga (Hatha)', category: 'Flexibility', metValue: 3.0, description: 'Standard yoga pose and breathing.' },
  { name: 'Basketball (Game)', category: 'Sports', metValue: 8.0, description: 'Competitive match/game.' },
  { name: 'Bicycling (Moderate)', category: 'Cardio', metValue: 8.0, description: 'Cycling at 12-14 mph.' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await FoodItem.deleteMany();
    await FoodItem.insertMany(foods);
    
    await Recipe.deleteMany();
    await Recipe.insertMany(recipes);

    await Activity.deleteMany();
    await Activity.insertMany(activities);
    
    console.log('Database Seeded Successfully with Foods, Recipes, and Activities');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
