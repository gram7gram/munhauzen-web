const express = require('express');
const Scenario = require('../../database/model/Scenario').Scenario;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();

router.get('/scenario', async (req, res) => {

  try {
    const items = await Scenario.find().lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/scenario/:id', checkId, async (req, res) => {

  try {

    const entity = await Scenario.findById(req.params.id).lean()
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

router.post('/scenario', async (req, res) => {

  try {
    const entity = new Scenario(req.body)

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

router.put('/scenario/:id', checkId, async (req, res) => {
  try {

    const entity = await Scenario.findById(req.params.id)
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

router.delete('/scenario/:id', checkId, async (req, res) => {
  try {

    await Scenario.deleteOne({_id: req.params.id})

    res.status(201).json(null)

  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;

