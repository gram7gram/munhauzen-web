const express = require('express');
const inventoryService = require('../services/InventoryService')
const Inventory = require('../../database/model/Inventory').Inventory;
const checkId = require('../services/RequestParamsValidator').checkId
const router = new express.Router();

router.get('/inventory', async (req, res) => {

  try {
    const items = await Inventory.find().sort({name: 'asc'}).lean()

    res.status(200).json({
      items,
      count: items.length
    })
  } catch (e) {
    res.status(500).json(e)
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
    res.status(500).json(e)
  }
})

router.post('/inventory', async (req, res) => {

  try {

    const entity = inventoryService.create(req.body)

    res.status(201).json(entity)

  } catch (e) {
    res.status(500).json(e)
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

    inventoryService.update(entity, req.body)

    res.status(200).json(entity.toObject())

  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/inventory/:id', checkId, async (req, res) => {
  try {

    await Inventory.deleteOne({_id: req.params.id})

    res.status(204).json(null)

  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;

