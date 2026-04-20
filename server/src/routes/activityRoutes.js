const express = require('express');
const { logActivity, getActivities, getRecentActivities, deleteActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/log', logActivity);
router.get('/search', getActivities);
router.get('/recent', getRecentActivities);
router.delete('/:logId/:activityIndex', deleteActivity);

module.exports = router;
