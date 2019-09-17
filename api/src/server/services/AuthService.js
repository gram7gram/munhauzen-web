const jwt = require('jsonwebtoken')
const logger = require('../../logger')
const params = require('../../../parameters')

const isAdmin = (req, res, next) => {

  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({
      message: "Missing authorization header"
    });
    return
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.isAdmin !== true) {
      res.status(403).send("Access denied");
      return
    }

    req.user = decoded;

    next();

  } catch (e) {
    logger.error(e)

    res.status(401).json({
      message: "Not authorized"
    })
  }
}

const generateAuthToken = content => {
  return jwt.sign(content, params.secret);
}

const verifyToken = token => {
  return jwt.verify(token, params.secret);
}

const discardToken = token => {
  return jwt.unsign(token, params.secret);
}

module.exports = {
  isAdmin,
  verifyToken,
  generateAuthToken
}