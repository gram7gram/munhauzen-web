const express = require('express');
const inventoryService = require('../services/InventoryService')
const Inventory = require('../../database/model/Inventory').Inventory;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router({mergeParams: true});
const logger = require('../../logger');

router.get('/inventory', async (req, res) => {

  try {
    const items = await Inventory.find({locale: req.params.locale}).sort({name: 'asc'}).lean()

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

router.get('/inventory/:id', checkId, async (req, res) => {

  try {

    const entity = await Inventory.findById(req.params.id).lean()
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

router.post('/inventory', async (req, res) => {

  try {

    const entity = await inventoryService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.put('/inventory/:id', checkId, async (req, res) => {
  try {

    const entity = await Inventory.findById(req.params.id)
    if (!entity) {
      res.status(404).json({
        message: 'not found'
      })
      return
    }

    await inventoryService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {

    logger.error(e)

    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.delete('/inventory/:id', checkId, async (req, res) => {
  try {

    await Inventory.deleteOne({_id: req.params.id})

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

