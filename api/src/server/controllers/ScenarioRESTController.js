const express = require('express');
const scenarioService = require('../services/ScenarioService')
const Scenario = require('../../database/model/Scenario').Scenario;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router({mergeParams: true});

router.get('/scenario', async (req, res) => {

  try {
    const items = await Scenario.find({locale: req.params.locale})
      .sort({isReserved: 'desc', isBegin: 'desc', name: 'asc'})
      .lean()

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

router.get('/scenario/:id', checkId, async (req, res) => {

  try {

    const entity = await Scenario.findOne({_id: req.params.id, isReserved: {$ne: true}}).lean()
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

router.post('/scenario', async (req, res) => {

  try {

    const entity = await scenarioService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/scenario/:id', checkId, async (req, res) => {
  try {

    const entity = await Scenario.findOne({_id: req.params.id, isReserved: {$ne: true}})
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await scenarioService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/scenario/:id', checkId, async (req, res) => {
  try {

    await Scenario.deleteOne({_id: req.params.id, isReserved: {$ne: true}})

    res.status(204).json(null)

  } catch (e) {

    

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

