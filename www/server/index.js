const express = require('express');
//const morgan = require('morgan');

const IndexController = require(`./controllers/IndexController`);
const ErrorLogger = require(`./services/ErrorLogger`);

const app = express();

app.use(IndexController)

app.use(express.static(`./build`));

//app.use(morgan('tiny'))

app.use('*', (req, res) => {
  res.redirect('/')
})

app.use(ErrorLogger)

module.exports = app