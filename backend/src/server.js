import app from './app.js';
import logger from './utils/logger.js';
import { PORT } from './config/env.js';

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;
