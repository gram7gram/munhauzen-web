const parameters = require('../../parameters')

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const host = parameters.mongoHost

const params = {
  //user: process.env.MONGO_USER,
  //pass: process.env.MONGO_PASS,
}

const connect = (host, opts = {}) => {

  opts.useNewUrlParser = true
  opts.useFindAndModify = false

  mongoose.connect(host, opts).catch(e => {
    
  })
}

mongoose.connection.on('connected', () => {

  console.log(`Connected with mongo database @ ${host}`);

})

mongoose.connection.on('error', (err) => {

  console.error(`Error with mongo database @ ${host}`);
  console.error(err.stack);

})

mongoose.connection.on('disconnected', () => {

  console.error(`Disconnected from mongo database @ ${host}`);

  setTimeout(() => {
    connect(host, params)
  }, 1000)
});

module.exports = {
  connect: () => {
    connect(host, params)
  },
  disconnect: (done) => {
    mongoose.disconnect(done).catch(e => {
      
    });
  },
};
