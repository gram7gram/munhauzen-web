const path = require('path');
const express = require('express');

const router = new express.Router({mergeParams: true});

router.get('/login', (req, res) => {

  const indexFile = path.resolve(__dirname, '../../build/index.html')

  res.sendFile(indexFile);
});

module.exports = router;

