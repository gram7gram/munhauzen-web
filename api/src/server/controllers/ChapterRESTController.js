const express = require('express');
const chapterService = require('../services/ChapterService')
const Chapter = require('../../database/model/Chapter').Chapter;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();
const logger = require('../../logger');

router.get('/chapters', async (req, res) => {

  try {
    const items = await Chapter.find().sort({number: 'asc'}).lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.get('/chapters/:id', checkId, async (req, res) => {

  try {

    const entity = await Chapter.findById(req.params.id).lean()
    if (!entity) {
      res.status(404).json({
        message: 'not found',
      })
      return
    }

    res.status(200).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.post('/chapters', async (req, res) => {

  try {

    const entity = await chapterService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/chapters/:id', checkId, async (req, res) => {
  try {

    const entity = await Chapter.findById(req.params.id)
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await chapterService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/chapters/:id', checkId, async (req, res) => {
  try {

    await Chapter.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

