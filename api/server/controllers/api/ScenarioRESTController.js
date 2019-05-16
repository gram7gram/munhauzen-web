
const express = require('express');
const router = new express.Router();

router.get('/scenario', (req, res) => {

  res.status(200).json({
    items: [],
    count: 0
  })
})

router.post('/scenario', (req, res) => {

  res.status(201).json({
    id: null
  })
})

router.get('/scenario/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

router.put('/scenario/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

module.exports = router;

