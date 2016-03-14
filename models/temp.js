'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Temps', Schema({
  heat: Number,
  cool: Number,
  latitude: Number,
  longitude: Number,
}));
