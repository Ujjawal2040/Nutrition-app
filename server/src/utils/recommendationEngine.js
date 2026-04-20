/**
 * Recommendation Engine for Protus
 * Calculates BMR, TDEE, and personalized nutrient targets
 */

const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const getActivityMultiplier = (level) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  return multipliers[level] || 1.2;
};

const calculateTargets = (profile) => {
  const { weight, height, age, gender, activityLevel, dietaryPreference } = profile;
  
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * getActivityMultiplier(activityLevel);
  
  // Default Goal: Maintenance (can be adjusted for weight loss/gain)
  const calories = Math.round(tdee);
  
  // Protein: 1.8g per kg for moderately active, adjusted based on level
  const proteinPerKg = activityLevel === 'sedentary' ? 1.2 : activityLevel === 'very_active' ? 2.2 : 1.8;
  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4;
  
  // Fats: 25% of total calories
  const fatCalories = calories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  
  // Carbs: Remainder
  const carbCalories = calories - (proteinCalories + fatCalories);
  const carbGrams = Math.round(carbCalories / 4);
  
  // Dietary Specific Adjustments (Micronutrients)
  // Non-bioavailable sources in veg diets require higher targets
  const micronutrients = {
    iron: dietaryPreference === 'vegetarian' ? 18 * 1.8 : 18, // mg
    calcium: 1000, // mg
    vitaminB12: dietaryPreference === 'vegetarian' ? 2.4 * 2.0 : 2.4, // mcg (extra for veg)
    zinc: dietaryPreference === 'vegetarian' ? 11 * 1.5 : 11, // mg
    vitaminD: 600, // IU
  };
  
  return {
    calories,
    macros: {
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams
    },
    micronutrients
  };
};

module.exports = {
  calculateTargets
};
