'use strict'

const apiC = require('../controllers/api'),
      router = require('express').Router();

router.get('/api', apiC.detail)
      .get('/api/detail', apiC.detail)
      .get('/api/detail/:state', apiC.detail)
      .get('/api/detail/:state/:county', apiC.detail)
      .get('/api/summary', apiC.summary)
      .get('/api/summary/:state', apiC.summary)
      .get('/api/summary/:state/:county', apiC.summary)
      .post('/api', apiC.new)

module.exports = router;
