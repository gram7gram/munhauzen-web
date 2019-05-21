const express = require('express');
const imageService = require('../services/ImageService')
const Image = require('../../database/model/Image').Image;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();

router.get('/images', async (req, res) => {

  try {
    const items = await Image.find().sort({_id: -1}).lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/images/:id', checkId, async (req, res) => {

  try {

    const entity = await Image.findById(req.params.id).lean()
    if (!entity) {
      res.status(404).json({
        message: 'not found',
      })
      return
    }

    res.status(200).json(entity)

  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/images', async (req, res) => {

  try {

    const entity = imageService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/images/:id', checkId, async (req, res) => {
  try {

    const entity = await Image.findById(req.params.id)
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    imageService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/images/:id', checkId, async (req, res) => {
  try {

    await Image.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;

