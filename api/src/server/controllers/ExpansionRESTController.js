const express = require('express');
const router = new express.Router({mergeParams: true});
const logger = require('../../logger');
const host = require('../../../parameters').host;

const expansions = {
  1: {
    en: {
      hdpi: {
        getExpansion: () => require('../resources/1-en-hdpi-expansion.json')
      },
      mdpi: {
        getExpansion: () => require('../resources/1-en-mdpi-expansion.json')
      }
    }
  }
}

router.get('/expansions/:version/:dpi', (req, res, next) => {

  if (['mdpi', 'hdpi'].indexOf(req.params.dpi) === -1) {
    res.status(400).json({
      message: 'Invalid `dpi` in request',
    })
    return
  }

  if ([1].indexOf(parseInt(req.params.version)) === -1) {
    res.status(400).json({
      message: 'Invalid `version` in request',
    })
    return
  }

  next()

}, async (req, res) => {

  try {

    const {dpi, locale} = req.params
    const version = parseInt(req.params.version)

    if (typeof expansions[version][locale][dpi] === "undefined") {
      throw {
        code: 404,
        message: 'Не найдено'
      }
    }

    const expansion = expansions[version][locale][dpi].getExpansion()

    expansion.parts.items = expansion.parts.items.map(item => ({
      ...item,
      url: host + item.path
    }))

    res.status(200).json(expansion)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

