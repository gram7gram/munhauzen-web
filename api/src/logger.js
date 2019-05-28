const winston = require('winston')
const path = require('path')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  // defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: path.resolve(__dirname, '../logs/error.log'), level: 'error'}),
    new winston.transports.File({filename: path.resolve(__dirname, '../logs/combined.log')})
  ]
});


// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger