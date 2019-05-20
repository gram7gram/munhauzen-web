const path = require('path');
const express = require('express');
const Router = new express.Router();

const indexFile = path.resolve(__dirname + '../../../build/index.html')

const index = (req, res) => {
  res.status(200).sendFile(indexFile);
}

const routes = [
  '/',
  '/scenario',
  '/images',
  '/audio',
  '/audio-fails',
]

routes.forEach(route => {
  Router.get(route, index);
})


module.exports = Router;

