const path = require('path');
const parameters = require('../../parameters');
const {i18n} = require('../i18n');
const template = require('nunjucks');
const moment = require('moment');

const views = path.resolve(__dirname, '../views')

const index = (req, res) => {

  const result = template.render(`${views}/index.html.twig`, {
    moment,
    parameters,
    locale: req.locale,
    i18n,
    req,
  })

  res.send(result)
}

const privacy = (req, res) => {

  const result = template.render(`${views}/privacy.html.twig`, {
    moment,
    parameters,
    locale: req.locale,
    i18n,
    req,
  })

  res.send(result)
}

module.exports = {
  index,
  privacy,
};

