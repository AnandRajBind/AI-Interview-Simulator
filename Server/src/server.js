require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const validateEnv = require('./config/validateEnv');

const PORT = process.env.PORT || 5000;

// Validate environment variables before starting
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
