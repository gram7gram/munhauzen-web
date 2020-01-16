const path = require('path');
const parameters = require('../../parameters');
const {i18n} = require('../i18n');
const template = require('nunjucks');

const views = path.resolve(__dirname, '../views')

const index = (req, res) => {

  const result = template.render(`${views}/index.html.twig`, {
    parameters,
    locale: req.locale,
    i18n,
    req,
  })

  res.send(result)
}

const privacy = (req, res) => {

  const result = template.render(`${views}/privacy.html.twig`, {
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

