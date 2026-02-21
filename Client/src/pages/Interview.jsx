import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interview.service';

const domains = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'Data Structures',
  'System Design',
  'Database',
  'DevOps',
  'Machine Learning'
];

const difficulties = ['easy', 'medium', 'hard'];

const Interview = () => {
  const [step, setStep] = useState('setup'); // setup, interview, result
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!domain || !difficulty) {
      setError('Please select both domain and difficulty');
      return;
    }

    setLoading(true);

    try {
      const response = await interviewService.startInterview(domain, difficulty);
      setInterviewId(response.data.interviewId);
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setStep('interview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setError('');
    
    // Check if all questions are answered
    const unanswered = answers.filter(ans => !ans.trim()).length;
    if (unanswered > 0) {
      setError(`Please answer all questions. ${unanswered} question(s) remaining.`);
      return;
    }

    setLoading(true);

    try {
      const response = await interviewService.submitInterview(interviewId, answers);
      setResult(response.data);
      setStep('result');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewInterview = () => {
    setStep('setup');
    setDomain('');
    setDifficulty('');
    setInterviewId(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">AI Interview Simulator</h1>
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Setup Step */}
        {step === 'setup' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Start New Interview</h2>
            <p className="text-gray-600 mb-6">Select your domain and difficulty level to begin</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleStartInterview}>
              <div className="mb-6">
                <label htmlFor="domain" className="block text-gray-700 font-medium mb-2">
                  Domain
                </label>
                <select
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                >
                  <option value="">Select a domain</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                >
                  <option value="">Select difficulty</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Questions...
                  </span>
                ) : (
                  'Start Interview'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Interview Step */}
        {step === 'interview' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {domain} Interview
                  </h2>
                  <p className="text-sm text-gray-600">
                    Difficulty: <span className="font-medium capitalize">{difficulty}</span>
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3 text-lg">
                Question {currentQuestionIndex + 1}:
              </label>
              <p className="text-gray-800 text-base sm:text-lg mb-6 p-4 bg-gray-50 rounded-lg">
                {questions[currentQuestionIndex]}
              </p>

              <label htmlFor="answer" className="block text-gray-700 font-medium mb-2">
                Your Answer:
              </label>
              <textarea
                id="answer"
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                placeholder="Type your answer here..."
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                {answers[currentQuestionIndex].length} characters
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Interview'
                  )}
                </button>
              )}
            </div>

            {/* Question Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full font-medium text-sm transition ${
                    index === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : answers[index].trim()
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && result && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Interview Completed!</h2>
              <p className="text-gray-600">Here are your results</p>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
                <p className="text-sm uppercase tracking-wide mb-2">Overall Score</p>
                <p className="text-5xl sm:text-6xl font-bold">{result.overallScore}</p>
                <p className="text-sm mt-2 opacity-90">out of 100</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Individual Question Scores</h3>
              <div className="space-y-3">
                {result.scores.map((score, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium min-w-[100px]">Question {index + 1}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-800 min-w-[50px] text-right">{score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Feedback</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleNewInterview}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Start New Interview
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
