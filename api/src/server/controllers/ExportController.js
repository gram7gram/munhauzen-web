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

    res.status(500).json(e)
  }
})

module.exports = router;

