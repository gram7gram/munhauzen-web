const express = require('express');
const Chapter = require('../../database/model/Chapter').Chapter;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();

router.get('/chapters', async (req, res) => {

  try {
    const items = await Chapter.find().lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {
    res.status(500).json(e)
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
    res.status(500).json(e)
  }
})

router.post('/chapters', async (req, res) => {

  try {
    const entity = new Chapter(req.body)

    const validator = entity.validateSync();
    if (validator) {
      res.status(400).json({
        message: 'Bad request',
        errors: validator.errors
      })
      return
    }

    await entity.save()

    res.status(201).json(entity.toObject())

  } catch (e) {
    res.status(500).json(e)
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

    entity.set(req.body);

    const validator = entity.validateSync();
    if (validator) {
      res.status(400).json({
        message: 'Bad request',
        errors: validator.errors
      })
      return
    }

    await entity.update()

    res.status(200).json(entity.toObject())

  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/chapters/:id', checkId, async (req, res) => {
  try {

    await Chapter.deleteOne({_id: req.params.id})

    res.status(201).json(null)

  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;

