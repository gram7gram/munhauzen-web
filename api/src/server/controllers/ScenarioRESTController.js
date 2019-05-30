const express = require('express');
const scenarioService = require('../services/ScenarioService')
const Scenario = require('../../database/model/Scenario').Scenario;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();
const logger = require('../../logger');

router.get('/scenario', async (req, res) => {

  try {
    const items = await Scenario.find().sort({name: 'asc'}).lean()

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

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.post('/scenario', async (req, res) => {

  try {

    const entity = await scenarioService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
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

    await scenarioService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/scenario/:id', checkId, async (req, res) => {
  try {

    await Scenario.deleteOne({_id: req.params.id})

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

