import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/neuraloom';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
