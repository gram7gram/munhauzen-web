const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const IndexController = require('./controllers/IndexController');
const ErrorLogger = require('./services/ErrorLogger');

const app = express();

app.use(cookieParser())

app.use((req, res, next) => {

  res.cookie('locale', req.params.locale || 'en');

  next();
});

app.use('/:locale', (req, res, next) => {

  if (['en', 'ru', 'ua'].indexOf(req.params.locale) === -1) {
    res.redirect('/en')
    return
  }

  next()
}, IndexController)

app.use(express.static(path.resolve(__dirname, '../build')))

app.use('*', (req, res) => {
  res.redirect('/en')
})

app.use(ErrorLogger)

module.exports = app