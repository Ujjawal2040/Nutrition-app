const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const recipes = await Recipe.find(filter);
    
    res.status(200).json({
      status: 'success',
      results: recipes.length,
      data: { recipes }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    res.status(200).json({
      status: 'success',
      data: { recipe }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
