
module.exports = (err, req, res, next) => {

  //logger.log('error', {'status': status, 'message': message, 'stack': stack, 'raw': raw});

  next(err);

}