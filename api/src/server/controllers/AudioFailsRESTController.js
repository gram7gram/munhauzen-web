const express = require('express');
const audioFailService = require('../services/AudioFailService')
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router({mergeParams: true});

router.get('/audio-fails', async (req, res) => {

  try {
    const items = await AudioFail.find({locale: req.params.locale}).sort({name: 'asc'}).lean()

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

router.get('/audio-fails/:id', checkId, async (req, res) => {

  try {

    const entity = await AudioFail.findById(req.params.id).lean()
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

router.post('/audio-fails', async (req, res) => {

  try {

    const entity = await audioFailService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/audio-fails/:id', checkId, async (req, res) => {
  try {

    const entity = await AudioFail.findById(req.params.id)
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await audioFailService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/audio-fails/:id', checkId, async (req, res) => {
  try {

    await AudioFail.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

