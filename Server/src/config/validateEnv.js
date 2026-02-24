/**
 * Validate that all required environment variables are set
 * @throws {Error} if any required variable is missing
 */
const validateEnv = () => {
  const required = [
    'PORT',
    'NODE_ENV',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'OPENAI_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate JWT_SECRET is not the default value
  if (process.env.JWT_SECRET === 'your_jwt_secret_key_here_change_in_production') {
    throw new Error(
      'JWT_SECRET is set to the default value. Please change it to a secure random string.'
    );
  }

  // Validate OPENAI_API_KEY format
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY appears to be invalid. It should start with "sk-"');
    console.warn('⚠️  Interview features will not work without a valid OpenAI key');
  }

  console.log('✓ Environment variables validated successfully');
};

module.exports = validateEnv;
