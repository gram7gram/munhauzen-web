const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan')
const langParser = require('accept-language-parser')
const prepareTranslations = require('./i18n').prepareTranslations

const publicDir = path.resolve(__dirname, '../public')

const IndexController = require('./controllers/IndexController');

const app = express();

app.use(cors())
app.use(morgan('tiny'))

app.use((req, res, next) => {

  const defaultLocale = 'en'
  const supported = ['en', 'ru']

  let locale = langParser.pick(supported, req.headers['accept-language'] || '')
  if (!locale) {
    locale = defaultLocale
  }

  prepareTranslations(locale)

  next()
})

app.use(IndexController)

app.use(express.static(publicDir))

app.use('*', (req, res) => {
  res.status(404).send('Not found')
})

module.exports = app