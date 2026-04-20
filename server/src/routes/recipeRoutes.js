const express = require('express');
const { getAllRecipes, getRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

module.exports = router;
