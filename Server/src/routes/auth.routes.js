const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/register', authLimiter, validateRegistration, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);

module.exports = router;
