const path = require('path');
const express = require('express');
const parameters = require('../../parameters');
const i18n = require('../i18n').i18n;
const template = require('nunjucks');

const views = path.resolve(__dirname, '../views')

const router = new express.Router({mergeParams: true});

router.get('/', async (req, res) => {

  const result = template.render(`${views}/index.html.twig`, {
    parameters,
    i18n,
  })

  res.send(result)
});

// router.get('/privacy', (req, res) => {
//
//   const result = template.render(`${views}/privacy.html.twig`, {
//     parameters,
//     moment,
//   })
//
//   res.send(result)
// });

module.exports = router;

