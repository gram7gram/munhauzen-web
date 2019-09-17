
const logger = require('../logger')

module.exports = (err, req, res, next) => {

  logger.error(err);

  next(err);
}