'use strict'

const router = require('express').Router();

const apiC = require('../controllers/api');
router.get('/api', apiC.index)
      .get('/api/full', apiC.index)
      .get('/api/full/:state', apiC.index)
      .get('/api/full/:state/:area', apiC.index)
      .get('/api/detail', apiC.detail)
      .get('/api/detail/:state', apiC.detail)
      .get('/api/detail/:state/:area', apiC.detail)
      .post('/api', apiC.new)

module.exports = router;
