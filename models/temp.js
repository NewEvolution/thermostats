'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Temps', Schema({
  heat: int,
  cool: int,
  latitude: long,
  longitude: long,
}));
