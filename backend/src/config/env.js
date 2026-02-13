require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/neuraloom',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
