const express = require('express');
const morgan = require('morgan');

const IndexController = require(`./controllers/IndexController`);
const ErrorLogger = require(`./services/ErrorLogger`);

const app = express();

app.use(express.static(`./public`));

app.use(morgan('tiny'))

app.use(IndexController);

app.use(ErrorLogger);

module.exports = app