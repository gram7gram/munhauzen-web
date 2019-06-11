const express = require('express');
const logger = require('../../logger');

const service = require('../services/ExportService')
const router = new express.Router();

router.get('/export', async (req, res) => {

  try {

    const result = await service.generateArchive()

    res.status(200).json(result)

  } catch (e) {

    logger.error(e);

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

