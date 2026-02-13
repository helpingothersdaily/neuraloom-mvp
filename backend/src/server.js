const app = require('./app');
const logger = require('./utils/logger');
const { PORT } = require('./config/env');

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

module.exports = server;
