const express = require('express');
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
      throw result
    }

    res.status(201).json(result)

  } catch (e) {

    console.log(e);
    res.status(500).json(e)
  }
})

module.exports = router;

