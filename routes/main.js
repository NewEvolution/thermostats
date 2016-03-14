'use strict'

const router = require('express').Router();

const apiC = require('../controllers/api');
router.get('/', apiC.index)
      .post('/', apiC.new)

module.exports = router;
