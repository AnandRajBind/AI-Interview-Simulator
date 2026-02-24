const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Retry wrapper for OpenAI API calls
 */
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      const isRateLimitError = error.status === 429;
      const isServerError = error.status >= 500;
      
      if (isLastAttempt || (!isRateLimitError && !isServerError)) {
        throw error;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

const generateQuestions = async (domain, difficulty) => {
  try {
    const prompt = `Generate 5 interview questions for the ${domain} domain at ${difficulty} difficulty level. 
Return only a JSON array of question strings, no additional text.
Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    const result = await retryWithBackoff(async () => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer. Generate relevant, challenging questions based on the domain and difficulty level.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion;
    });

    const response = result.choices[0].message.content.trim();
    
    // Validate JSON response
    let questions;
    try {
      questions = JSON.parse(response);
      if (!Array.isArray(questions) || questions.length !== 5) {
        throw new Error('Invalid questions format');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Failed to parse AI response');
    }

    return {
      success: true,
      questions
    };
  } catch (error) {
    console.error('Error generating questions:', error);
    
    let message = 'Failed to generate questions';
    if (error.status === 429) {
      message = 'AI service is rate limited. Please try again in a moment.';
    } else if (error.status === 401) {
      message = 'AI service authentication failed. Please contact support.';
    } else if (error.status >= 500) {
      message = 'AI service is temporarily unavailable. Please try again later.';
    }
    
    return {
      success: false,
      message,
      error: error.message
    };
  }
};

const evaluateAnswers = async (questions, answers) => {
  try {
    const evaluationPrompt = `Evaluate the following interview answers. For each question-answer pair, provide a score between 0-100 and brief feedback.

Questions and Answers:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer provided'}`).join('\n\n')}

Return a JSON object with the following structure:
{
  "scores": [score1, score2, score3, ...],
  "overallScore": averageScore,
  "feedback": "overall feedback paragraph"
}`;

    const result = await retryWithBackoff(async () => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer. Evaluate answers objectively, considering correctness, depth, and clarity.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });

      return completion;
    });

    const response = result.choices[0].message.content.trim();
    
    // Validate JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(response);
      
      // Validate structure
      if (!evaluation.scores || !Array.isArray(evaluation.scores)) {
        throw new Error('Invalid evaluation format: scores missing');
      }
      if (typeof evaluation.overallScore !== 'number') {
        throw new Error('Invalid evaluation format: overallScore missing');
      }
      if (!evaluation.feedback || typeof evaluation.feedback !== 'string') {
        throw new Error('Invalid evaluation format: feedback missing');
      }
      
      // Validate scores are within range
      evaluation.scores = evaluation.scores.map(score => {
        const num = Number(score);
        return Math.max(0, Math.min(100, num));
      });
      
      evaluation.overallScore = Math.max(0, Math.min(100, Number(evaluation.overallScore)));
      
    } catch (parseError) {
      console.error('Failed to parse evaluation response:', response);
      throw new Error('Failed to parse AI evaluation');
    }

    return {
      success: true,
      ...evaluation
    };
  } catch (error) {
    console.error('Error evaluating answers:', error);
    
    let message = 'Failed to evaluate answers';
    if (error.status === 429) {
      message = 'AI service is rate limited. Please try again in a moment.';
    } else if (error.status === 401) {
      message = 'AI service authentication failed. Please contact support.';
    } else if (error.status >= 500) {
      message = 'AI service is temporarily unavailable. Please try again later.';
    }
    
    return {
      success: false,
      message,
      error: error.message
    };
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswers
};
