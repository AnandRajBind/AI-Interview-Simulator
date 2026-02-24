/**
 * Validation middleware for request inputs
 */

const validateInterviewStart = (req, res, next) => {
  const { domain, difficulty } = req.body;
  const errors = [];

  // Validate domain
  if (!domain || typeof domain !== 'string') {
    errors.push('Domain is required and must be a string');
  } else if (domain.trim().length === 0) {
    errors.push('Domain cannot be empty');
  } else if (domain.length > 100) {
    errors.push('Domain must be less than 100 characters');
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!difficulty || typeof difficulty !== 'string') {
    errors.push('Difficulty is required and must be a string');
  } else if (!validDifficulties.includes(difficulty.toLowerCase())) {
    errors.push('Difficulty must be one of: easy, medium, hard');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateInterviewSubmit = (req, res, next) => {
  const { interviewId, answers } = req.body;
  const errors = [];

  // Validate interviewId
  if (!interviewId || typeof interviewId !== 'string') {
    errors.push('Interview ID is required and must be a string');
  } else if (!/^[0-9a-fA-F]{24}$/.test(interviewId)) {
    errors.push('Invalid interview ID format');
  }

  // Validate answers
  if (!answers) {
    errors.push('Answers are required');
  } else if (!Array.isArray(answers)) {
    errors.push('Answers must be an array');
  } else {
    // Validate each answer
    answers.forEach((answer, index) => {
      if (typeof answer !== 'string') {
        errors.push(`Answer at index ${index} must be a string`);
      } else if (answer.length > 5000) {
        errors.push(`Answer at index ${index} exceeds maximum length of 5000 characters`);
      }
    });

    if (answers.length > 50) {
      errors.push('Too many answers (maximum 50)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  } else if (email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 100) {
    errors.push('Password must be less than 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (email.trim().length === 0) {
    errors.push('Email cannot be empty');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  } else if (password.trim().length === 0) {
    errors.push('Password cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateInterviewStart,
  validateInterviewSubmit,
  validateRegistration,
  validateLogin
};
