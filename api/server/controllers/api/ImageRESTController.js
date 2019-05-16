
const express = require('express');
const router = new express.Router();

router.get('/images', (req, res) => {

  res.status(200).json({
    items: [],
    count: 0
  })
})

router.post('/images', (req, res) => {

  res.status(201).json({
    id: null
  })
})

router.get('/images/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

router.put('/images/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

module.exports = router;

