const path = require('path');
const express = require('express');
const Router = new express.Router({mergeParams: true});

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

  const indexFile = path.resolve(__dirname + '../../../build/index.html')

  res.status(200).sendFile(indexFile);
}

routes.forEach(route => {
  Router.get(route, index);
})

module.exports = Router;

