'use strict'

const Temp = require('../models/temp');

module.exports = {
  index (req, res) {
    Temp.find({}).exec((err, temps) => {
      if (err) throw err;
      res.send(temps);
    });
  },

  new (req, res) {
    Temp.create(req.body, err => {
      if (err) {
        res.send({"success": false});
        throw err;
      }
      res.send({"success": true});
    });
  }
}
