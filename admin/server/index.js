const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const IndexController = require('./controllers/IndexController');
const LoginController = require('./controllers/LoginController');

const ErrorLogger = require('./services/ErrorLogger');
const checkLocale = require('./services/RequestParamsValidator').checkLocale;

const app = express();

app.use(cookieParser())

app.use((req, res, next) => {

  res.cookie('locale', req.params.locale || 'en');

  next();
});

app.use('/:locale', checkLocale, LoginController)
app.use('/:locale', checkLocale, IndexController)

app.use(express.static(path.resolve(__dirname, '../build')))

app.use('*', (req, res) => {
  res.redirect('/en')
})

app.use(ErrorLogger)

module.exports = app