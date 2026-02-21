const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (domain, difficulty) => {
  try {
    const prompt = `Generate 5 interview questions for the ${domain} domain at ${difficulty} difficulty level. 
Return only a JSON array of question strings, no additional text.
Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

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

    const response = completion.choices[0].message.content.trim();
    const questions = JSON.parse(response);

    return {
      success: true,
      questions
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to generate questions',
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

    const response = completion.choices[0].message.content.trim();
    const evaluation = JSON.parse(response);

    return {
      success: true,
      ...evaluation
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to evaluate answers',
      error: error.message
    };
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswers
};
