const express = require('express');
const path = require('path');
const logger = require('../../logger');

const service = require('../services/ExportService')
const router = new express.Router();

router.get('/downloads/game.zip', (req, res) => {
  const file = path.resolve(__dirname, `../../../public/downloads/game.zip`)

  res.sendFile(file)
})

router.get('/api/v1/export', async (req, res) => {

  try {

    const result = await service.generateArchive()

    res.status(200).json(result)

  } catch (e) {

    logger.error(e);

    res.status(500).json(e)
  }
})

module.exports = router;

