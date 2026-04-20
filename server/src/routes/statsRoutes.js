const express = require('express');
const { getWeeklyStats, updateGroceryList, toggleFavorite } = require('../controllers/statsController');
const { seedHistory } = require('../utils/seedUserHistory');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/weekly', getWeeklyStats);
router.post('/seed-history', seedHistory);
router.patch('/grocery', updateGroceryList);
router.post('/favorite', toggleFavorite);

module.exports = router;
