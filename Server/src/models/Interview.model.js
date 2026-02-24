const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard'],
    trim: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  questions: {
    type: [String],
    default: []
  },
  answers: {
    type: [String],
    default: []
  },
  scores: {
    type: [Number],
    default: []
  },
  overallScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Add indexes
interviewSchema.index({ userId: 1 });
interviewSchema.index({ createdAt: -1 });
interviewSchema.index({ status: 1, userId: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
