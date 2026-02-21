const express = require('express');
const { startInterview, submitInterview, getInterviewHistory } = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitInterview);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
