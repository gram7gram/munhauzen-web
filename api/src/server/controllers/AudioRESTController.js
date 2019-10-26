const express = require('express');
const audioService = require('../services/AudioService')
const Audio = require('../../database/model/Audio').Audio;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router({mergeParams: true});

router.get('/audio', async (req, res) => {

  try {
    const items = await Audio.find({locale: req.params.locale}).sort({name: 'asc'}).lean()

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

router.get('/audio/:id', checkId, async (req, res) => {

  try {

    const entity = await Audio.findById(req.params.id).lean()
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

router.post('/audio', async (req, res) => {

  try {

    const entity = await audioService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/audio/:id', checkId, async (req, res) => {
  try {

    const entity = await Audio.findById(req.params.id)
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await audioService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/audio/:id', checkId, async (req, res) => {
  try {

    await Audio.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

