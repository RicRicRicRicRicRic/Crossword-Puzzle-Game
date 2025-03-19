//utils/logger.js
const pino = require('pino');

const logger = process.env.NODE_ENV !== 'production'
  ? pino({
      level: process.env.LOG_LEVEL || 'debug',
      transport: {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    })
  : pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = logger;
