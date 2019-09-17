const path = require('path');
const express = require('express');

const router = new express.Router({mergeParams: true});

router.get('/login', (req, res) => {

  const indexFile = path.resolve(__dirname + '../../../build/index.html')

  res.status(200).sendFile(indexFile);
});

router.get('/logout', (req, res) => {
  res.redirect('/login')
});

module.exports = router;

