const express = require('express');
const imageService = require('../services/ImageService')
const Image = require('../../database/model/Image').Image;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router({mergeParams: true});

router.get('/images', async (req, res) => {

  try {
    const items = await Image.find({locale: req.params.locale}).sort({isReserved: 'desc', name: 'asc'}).lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.get('/images/:id', checkId, async (req, res) => {

  try {

    const entity = await Image.findOne({_id: req.params.id, isReserved: {$ne: true}}).lean()
    if (!entity) {
      res.status(404).json({
        message: 'not found',
      })
      return
    }

    res.status(200).json(entity)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.post('/images', async (req, res) => {

  try {

    const entity = await imageService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/images/:id', checkId, async (req, res) => {
  try {

    const entity = await Image.findOne({_id: req.params.id, isReserved: {$ne: true}})
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await imageService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/images/:id', checkId, async (req, res) => {
  try {

    await Image.deleteOne({_id: req.params.id, isReserved: {$ne: true}})

    res.status(204).json(null)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

