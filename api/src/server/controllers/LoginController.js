const express = require('express');
const parameters = require('../../../parameters');
const AuthService = require('../services/AuthService')

const router = new express.Router({mergeParams: true});

router.post('/login', async (req, res) => {

  try {

    const pass = req.body.password
    if (!pass) {
      res.status(400).json({
        message: 'Bad request'
      })
      return
    }

    if (parameters.users.admin.password !== pass) {
      res.status(401).json({
        message: 'Not authorized'
      })
      return
    }

    const user = {
      isAdmin: true
    }

    const token = AuthService.generateAuthToken(user)

    res.status(200).json({
      ...user,
      token
    })

  } catch (e) {



    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

router.post('/login-check', async (req, res) => {

  try {

    const token = req.body.token
    if (!token) {
      res.status(400).json({
        message: 'Bad request'
      })
      return
    }

    const user = AuthService.verifyToken(token)
    if (user.isAdmin !== true) {
      res.status(403).send("Access denied");
      return
    }

    res.status(200).json({
      ...user,
      token
    })

  } catch (e) {



    res.status(e.code > 400 ? e.code : 500).json({
      ...e,
      message: e.message || 'Ошибка...'
    })
  }
})

module.exports = router;

