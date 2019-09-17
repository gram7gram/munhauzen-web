const path = require('path');
const express = require('express');

const router = new express.Router({mergeParams: true});

const routes = [
  '',

  '/scenario',
  '/scenario/:id',

  '/images',
  '/images/:id',

  '/audio',
  '/audio/:id',

  '/audio-fails',
  '/audio-fails/:id',

  '/chapters',
  '/chapters/:id',

  '/inventory',
  '/inventory/:id',
]

const index = (req, res) => {

  const indexFile = path.resolve(__dirname, '../../build/index.html')

  res.sendFile(indexFile);
}

routes.forEach(route => {
  router.get(route, index);
})

module.exports = router;

