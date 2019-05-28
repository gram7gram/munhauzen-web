const logger = require('../logger')

const MONGO_HOST = process.env.MONGO_HOST;
if (!MONGO_HOST) {
  throw new Error('Missing MONGO_HOST env variable!')
}

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const params = {
  //user: process.env.MONGO_USER,
  //pass: process.env.MONGO_PASS,
}

const connect = (host, opts = {}) => {

  //opts.useMongoClient = true
  opts.useNewUrlParser = true
  opts.useFindAndModify = false

  mongoose.connect(host, opts);
}

mongoose.connection.on('connecting', () => {

  //console.log(`Establishing connection with mongo database @ ${MONGO_HOST}`);

});

mongoose.connection.on('connected', () => {

  logger.info(`Connected with mongo database @ ${MONGO_HOST}`);

});

mongoose.connection.on('error', (err) => {

  logger.error(`Error with mongo database @ ${MONGO_HOST}`);
  logger.error(err.stack);

});

mongoose.connection.on('disconnected', () => {

  logger.info(`Disconnected from mongo database @ ${MONGO_HOST}`);

  setTimeout(() => {
    connect(MONGO_HOST, params)
  }, 1000)
});

module.exports = {
  connect: () => {
    connect(MONGO_HOST, params)
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
