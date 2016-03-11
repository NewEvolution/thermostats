'use strict'

const router = require('express').Router();

const mainR = require('./main');

module.exports = router.use('/', mainR);
