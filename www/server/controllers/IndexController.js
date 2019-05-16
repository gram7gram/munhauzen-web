const path = require('path');
const express = require('express');
const Router = new express.Router();

const index = (req, res) => {
  res.status(200).sendFile(path.resolve('../../public/index.html'));
}

Router.get('/', index);

Router.get('/scenario', index);

Router.get('/images', index);

Router.get('/audio-fails', index);

Router.get('/*', index);

module.exports = Router;

