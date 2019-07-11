const express = require('express');
const router = new express.Router();
const logger = require('../../logger');
const host = require('../../../parameters').host;

const expansion1 = {
  "version": 1,
  "locale": "en",
  "device": "phone",
  "dpi": "hdpi",
  "size": 680358650,
  "parts": {
    "count": 10,
    "items": [
      {"size": 48852685, "part": 7, "path": "/expansions/1-en-phone-hdpi/part7.zip"},
      {"size": 56516954, "part": 3, "path": "/expansions/1-en-phone-hdpi/part3.zip"},
      {"size": 57552172, "part": 2, "path": "/expansions/1-en-phone-hdpi/part2.zip"},
      {"size": 60232912, "part": 5, "path": "/expansions/1-en-phone-hdpi/part5.zip"},
      {"size": 63296196, "part": 4, "path": "/expansions/1-en-phone-hdpi/part4.zip"},
      {"size": 63859650, "part": 8, "path": "/expansions/1-en-phone-hdpi/part8.zip"},
      {"size": 69335295, "part": 1, "path": "/expansions/1-en-phone-hdpi/part1.zip"},
      {"size": 82636431, "part": 6, "path": "/expansions/1-en-phone-hdpi/part6.zip"},
      {"size": 88038032, "part": 9, "path": "/expansions/1-en-phone-hdpi/part9.zip"},
      {"size": 90038323, "part": 10, "path": "/expansions/1-en-phone-hdpi/part10.zip"}
    ].map(item => ({
      ...item,
      url: host + item.path
    }))
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

    if (version === expansion1.version) {
      if (device === expansion1.device) {
        if (dpi === expansion1.dpi) {
          if (locale === expansion1.locale) {
            res.status(200).json(expansion1)
          }
        }
      }
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

