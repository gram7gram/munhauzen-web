const express = require('express');
const imageService = require('../services/ImageService')
const Image = require('../../database/model/Image').Image;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();
const logger = require('../../logger');

router.get('/images', async (req, res) => {

  try {
    const items = await Image.find().sort({name: 'asc'}).lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {

    logger.error(e)

    res.status(500).json(e)
  }
})

router.get('/images/:id', checkId, async (req, res) => {

  try {

    const entity = await Image.findOne({_id: req.params.id, isReserved: false}).lean()
    if (!entity) {
      res.status(404).json({
        message: 'not found',
      })
      return
    }

    res.status(200).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(500).json(e)
  }
})

router.post('/images', async (req, res) => {

  try {

    const entity = await imageService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(500).json(e)
  }
})

router.put('/images/:id', checkId, async (req, res) => {
  try {

    const entity = await Image.findOne({_id: req.params.id, isReserved: false}).lean()
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await imageService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    logger.error(e)

    res.status(500).json(e)
  }
})

router.delete('/images/:id', checkId, async (req, res) => {
  try {

    await Image.deleteOne({_id: req.params.id, isReserved: false})

    res.status(204).json(null)

  } catch (e) {

    logger.error(e)

    res.status(500).json(e)
  }
})

module.exports = router;

