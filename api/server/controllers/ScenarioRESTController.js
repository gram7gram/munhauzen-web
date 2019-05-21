const express = require('express');
const scenarioService = require('../services/ScenarioService')
const Scenario = require('../../database/model/Scenario').Scenario;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();

router.get('/scenario', async (req, res) => {

  try {
    const items = await Scenario.find().sort({_id: -1}).lean()

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

    const entity = scenarioService.create(req.body)

    res.status(201).json(entity)

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

    scenarioService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/scenario/:id', checkId, async (req, res) => {
  try {

    await Scenario.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;

