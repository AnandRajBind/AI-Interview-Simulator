const express = require('express');
const { startInterview, submitInterview, getInterviewHistory } = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const { interviewLimiter } = require('../middleware/rateLimiter');
const { validateInterviewStart, validateInterviewSubmit } = require('../middleware/validation');

const router = express.Router();

router.post('/start', protect, interviewLimiter, validateInterviewStart, startInterview);
router.post('/submit', protect, validateInterviewSubmit, submitInterview);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
