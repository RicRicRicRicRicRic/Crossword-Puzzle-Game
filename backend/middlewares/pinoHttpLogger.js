// middlewares/pinoHttpLogger.js
const pinoHttp = require('pino-http');
const logger = require('../utils/logger'); 

const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
});

module.exports = httpLogger;
