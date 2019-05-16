
const express = require('express');
const router = new express.Router();

router.get('/audio', (req, res) => {

  res.status(200).json({
    items: [],
    count: 0
  })
})

router.post('/audio', (req, res) => {

  res.status(201).json({
    id: null
  })
})

router.get('/audio/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

router.put('/audio/:id', (req, res) => {

  res.status(200).json({
    id: null
  })
})

module.exports = router;

