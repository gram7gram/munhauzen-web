const winston = require('winston')
const path = require('path')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  // defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: path.resolve(__dirname, '../logs/error.log'), level: 'error'}),
  ]
});

module.exports = logger