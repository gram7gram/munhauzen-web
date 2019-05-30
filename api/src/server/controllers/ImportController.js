const express = require('express');
const logger = require('../../logger');
const fileUpload = require('express-fileupload');

const importService = require('../services/ImportService')
const router = new express.Router();

router.post('/import', fileUpload(), async (req, res) => {

  try {

    const file = req.files.import
    if (!file) {
      throw {
        message: 'Файл не найден'
      }
    }

    const result = await importService.parse(file)
    if (result.hasErrors) {
      res.status(400).json({
        result: result.result
      })
      return
    }

    res.status(201).json({
      result: result.result
    })
  } catch (e) {

    logger.error(e);

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

