const express = require('express');
const { chat, transcribe, vision, getHealthGuide, getWorkoutDeepDive } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.use(protect);

router.post('/', chat);
router.post('/transcribe', upload.single('audio'), transcribe);
router.post('/vision', upload.single('image'), vision);
router.post('/health-guide', getHealthGuide);
router.post('/workout-deep-dive', getWorkoutDeepDive);

module.exports = router;
