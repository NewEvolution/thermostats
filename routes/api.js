'use strict'

const router = require('express').Router();

const apiC = require('../controllers/api');
router.get('/api', apiC.index)
      .post('/api', apiC.new)

module.exports = router;
