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
      {
        "size": 48852685,
        "part": 7,
        "path": "/expansions/1-en-phone-hdpi/part7.zip",
        "checksum": "dd1c704c265d0700a7a79b2667aa8226"
      },
      {
        "size": 56516954,
        "part": 3,
        "path": "/expansions/1-en-phone-hdpi/part3.zip",
        "checksum": "326e5c8a91e7020a23a4e967f86d5a75"
      },
      {
        "size": 57552172,
        "part": 2,
        "path": "/expansions/1-en-phone-hdpi/part2.zip",
        "checksum": "272d4a5e2f6eac92e0556df9ca654fea"
      },
      {
        "size": 60232912,
        "part": 5,
        "path": "/expansions/1-en-phone-hdpi/part5.zip",
        "checksum": "20b4c35656aebb818b3c444adc6f9898"
      },
      {
        "size": 63296196,
        "part": 4,
        "path": "/expansions/1-en-phone-hdpi/part4.zip",
        "checksum": "3ebdb4f8c85114ac6f6f0f420c1b6d26"
      },
      {
        "size": 63859650,
        "part": 8,
        "path": "/expansions/1-en-phone-hdpi/part8.zip",
        "checksum": "62f092b8b5b76019edb9f6249476e992"
      },
      {
        "size": 69335295,
        "part": 1,
        "path": "/expansions/1-en-phone-hdpi/part1.zip",
        "checksum": "1c1be47f522ab6078fa88cdfa0479e2b"
      },
      {
        "size": 82636431,
        "part": 6,
        "path": "/expansions/1-en-phone-hdpi/part6.zip",
        "checksum": "29cb7aff68397fc25a1a3bf195e4948e"
      },
      {
        "size": 88038032,
        "part": 9,
        "path": "/expansions/1-en-phone-hdpi/part9.zip",
        "checksum": "2eb09f29b0505def7b1c8bc4ea39fdf7"
      },
      {
        "size": 90038323,
        "part": 10,
        "path": "/expansions/1-en-phone-hdpi/part10.zip",
        "checksum": "7622e07054f4e95207d0e41e3e2b5ad3"
      }
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

