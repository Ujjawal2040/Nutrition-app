const express = require('express');
const { logFood, getDailyLog, searchFood, logWater } = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All nutrition routes protected

router.post('/log', logFood);
router.post('/water', logWater);
router.get('/log', getDailyLog);
router.get('/search', searchFood);

module.exports = router;
