const express = require('express');
const router = new express.Router();
const logger = require('../../logger');
const host = require('../../../parameters').host;

const expansions = {
  1: {
    en: {
      phone: {
        hdpi: {
          getExpansion: () => require('../resources/1-en-phone-hdpi-expansion.json')
        }
      }
    }
  }
}

router.get('/expansions/:version/:locale/:device/:dpi', (req, res, next) => {

  if (['phone', 'tablet'].indexOf(req.params.device) === -1) {
    res.status(400).json({
      message: 'Invalid `device` in request',
    })
    return
  }

  if (['en', 'ua', 'ru'].indexOf(req.params.locale) === -1) {
    res.status(400).json({
      message: 'Invalid `locale` in request',
    })
    return
  }

  if (['mdpi', 'hdpi', 'xhdpi'].indexOf(req.params.dpi) === -1) {
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

    const {device, dpi, locale} = req.params
    const version = parseInt(req.params.version)

    if (typeof expansions[version][locale][device][dpi] !== "undefined") {

      const expansion = expansions[version][locale][device][dpi].getExpansion()

      expansion.parts.items = expansion.parts.items.map(item => ({
        ...item,
        url: host + item.path
      }))

      res.status(200).json(expansion)
    }

    throw {
      code: 404,
      message: 'Не найдено'
    }

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

