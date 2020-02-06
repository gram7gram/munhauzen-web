const express = require('express');
const router = new express.Router({mergeParams: true});
const host = require('../../../parameters').host;

const expansions = {
  //ru
  '1-ru-mdpi-Part_demo': () => require('../resources/1-ru-mdpi-Part_demo-expansion.json'),
  '1-ru-mdpi-Part_1': () => require('../resources/1-ru-mdpi-Part_1-expansion.json'),
  '1-ru-mdpi-Part_2': () => require('../resources/1-ru-mdpi-Part_2-expansion.json'),
  '1-ru-hdpi-Part_demo': () => require('../resources/1-ru-hdpi-Part_demo-expansion.json'),
  '1-ru-hdpi-Part_1': () => require('../resources/1-ru-hdpi-Part_1-expansion.json'),
  '1-ru-hdpi-Part_2': () => require('../resources/1-ru-hdpi-Part_2-expansion.json'),

  //en
  '1-en-mdpi-Part_demo': () => require('../resources/1-en-mdpi-Part_demo-expansion.json'),
  '1-en-mdpi-Part_1': () => require('../resources/1-en-mdpi-Part_1-expansion.json'),
  '1-en-mdpi-Part_2': () => require('../resources/1-en-mdpi-Part_2-expansion.json'),
  '1-en-hdpi-Part_demo': () => require('../resources/1-en-hdpi-Part_demo-expansion.json'),
  '1-en-hdpi-Part_1': () => require('../resources/1-en-hdpi-Part_1-expansion.json'),
  '1-en-hdpi-Part_2': () => require('../resources/1-en-hdpi-Part_2-expansion.json'),

  //ru
  '2-ru-mdpi-Part_demo': () => require('../resources/2-ru-mdpi-Part_demo-expansion.json'),
  '2-ru-mdpi-Part_1': () => require('../resources/2-ru-mdpi-Part_1-expansion.json'),
  '2-ru-mdpi-Part_2': () => require('../resources/2-ru-mdpi-Part_2-expansion.json'),
  '2-ru-hdpi-Part_demo': () => require('../resources/2-ru-hdpi-Part_demo-expansion.json'),
  '2-ru-hdpi-Part_1': () => require('../resources/2-ru-hdpi-Part_1-expansion.json'),
  '2-ru-hdpi-Part_2': () => require('../resources/2-ru-hdpi-Part_2-expansion.json'),

  //en
  '2-en-mdpi-Part_demo': () => require('../resources/2-en-mdpi-Part_demo-expansion.json'),
  '2-en-mdpi-Part_1': () => require('../resources/2-en-mdpi-Part_1-expansion.json'),
  '2-en-mdpi-Part_2': () => require('../resources/2-en-mdpi-Part_2-expansion.json'),
  '2-en-hdpi-Part_demo': () => require('../resources/2-en-hdpi-Part_demo-expansion.json'),
  '2-en-hdpi-Part_1': () => require('../resources/2-en-hdpi-Part_1-expansion.json'),
  '2-en-hdpi-Part_2': () => require('../resources/2-en-hdpi-Part_2-expansion.json'),
}

router.get('/expansions/:version/:dpi', (req, res, next) => {

  if (['mdpi', 'hdpi'].indexOf(req.params.dpi) === -1) {
    res.status(400).json({
      message: 'Invalid `dpi` in request',
    })
    return
  }

  if ([
    'free',
    'full_munchausen_audiobook_eng',
    'part_2_munchausen_audiobook_eng',
    'part_1_munchausen_audiobook_eng',
    'full_munchausen_audiobook_ru',
    'part_2_munchausen_audiobook_ru',
    'part_1_munchausen_audiobook_ru',
  ].indexOf(req.query.product) === -1) {
    res.status(400).json({
      message: 'Invalid `product` in request',
    })
    return
  }

  next()

}, async (req, res) => {

  const {dpi, locale} = req.params
  const {product} = req.query
  const version = parseInt(req.params.version)

  let parts

  switch (product) {
    case "free":
      parts = ["Part_demo"]
      break
    case "full_munchausen_audiobook_ru":
    case "full_munchausen_audiobook_eng":
      parts = ["Part_demo", "Part_1", "Part_2"]
      break;
    case "part_2_munchausen_audiobook_ru":
    case "part_2_munchausen_audiobook_eng":
      parts = ["Part_demo", "Part_2"]
      break;
    case "part_1_munchausen_audiobook_ru":
    case "part_1_munchausen_audiobook_eng":
      parts = ["Part_demo", "Part_1"]
      break;
  }

  const result = {
    "version": version,
    "locale": locale,
    "dpi": dpi,
    "size": 0,
    "sizeMB": 0,
    "parts": {
      count: 0,
      items: []
    }
  }

  for (const part of parts) {
    const versionName = `${version}-${locale}-${dpi}-${part}`;

    if (typeof expansions[versionName] === "undefined") {
      res.status(404).json({
        message: 'Не найдено'
      })
    }

    const expansion = expansions[versionName]()

    result.size += expansion.size
    result.sizeMB += expansion.sizeMB

    result.parts.items = result.parts.items.concat(expansion.parts.items.map(item => ({
      ...item,
      partKey: `${part}-${item.part}`,
      url: host + item.path
    })))
  }

  let i = 1;
  for (const part of result.parts.items) {
    part.part = i;
    i++;
  }

  result.parts.count = result.parts.items.length

  res.status(200).json(result)
})

module.exports = router;

