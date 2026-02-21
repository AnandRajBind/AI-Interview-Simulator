const Interview = require('../models/Interview.model');
const { generateQuestions, evaluateAnswers } = require('../services/ai.service');

/**
 * @desc    Start a new interview
 * @route   POST /api/interviews/start
 * @access  Private
 */
const startInterview = async (req, res, next) => {
  try {
    const { domain, difficulty } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!domain || !difficulty) {
      const error = new Error('Please provide domain and difficulty');
      error.statusCode = 400;
      throw error;
    }

    // Validate difficulty level
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      const error = new Error('Difficulty must be easy, medium, or hard');
      error.statusCode = 400;
      throw error;
    }

    // Generate questions using AI service
    const result = await generateQuestions(domain, difficulty);

    if (!result.success) {
      const error = new Error(result.message || 'Failed to generate questions');
      error.statusCode = 500;
      throw error;
    }

    // Create interview document
    const interview = await Interview.create({
      userId,
      domain,
      difficulty: difficulty.toLowerCase(),
      questions: result.questions,
      answers: [],
      scores: [],
      overallScore: 0,
      feedback: ''
    });

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interviewId: interview._id,
        questions: interview.questions,
        domain: interview.domain,
        difficulty: interview.difficulty
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit interview answers
 * @route   POST /api/interviews/submit
 * @access  Private
 */
const submitInterview = async (req, res, next) => {
  try {
    const { interviewId, answers } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!interviewId || !answers) {
      const error = new Error('Please provide interviewId and answers');
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(answers)) {
      const error = new Error('Answers must be an array');
      error.statusCode = 400;
      throw error;
    }

    // Fetch interview from database
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      const error = new Error('Interview not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify interview belongs to authenticated user
    if (interview.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized to submit this interview');
      error.statusCode = 403;
      throw error;
    }

    // Validate answers count matches questions count
    if (answers.length !== interview.questions.length) {
      const error = new Error(`Expected ${interview.questions.length} answers, received ${answers.length}`);
      error.statusCode = 400;
      throw error;
    }

    // Call AI service to evaluate answers
    const evaluation = await evaluateAnswers(interview.questions, answers);

    if (!evaluation.success) {
      const error = new Error(evaluation.message || 'Failed to evaluate answers');
      error.statusCode = 500;
      throw error;
    }

    // Update interview with evaluation results
    interview.answers = answers;
    interview.scores = evaluation.scores;
    interview.overallScore = evaluation.overallScore;
    interview.feedback = evaluation.feedback;

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview submitted successfully',
      data: {
        interviewId: interview._id,
        scores: interview.scores,
        overallScore: interview.overallScore,
        feedback: interview.feedback
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get interview history for user
 * @route   GET /api/interviews/history
 * @access  Private
 */
const getInterviewHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch interviews for the user, sorted by most recent
    const interviews = await Interview.find({ userId })
      .select('domain difficulty overallScore createdAt')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalInterviews = interviews.length;
    const averageScore = totalInterviews > 0
      ? interviews.reduce((sum, int) => sum + int.overallScore, 0) / totalInterviews
      : 0;

    res.status(200).json({
      success: true,
      data: {
        interviews,
        statistics: {
          totalInterviews,
          averageScore: Math.round(averageScore * 10) / 10
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitInterview,
  getInterviewHistory
};
