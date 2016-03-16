'use strict'

const db = require('../models/');

module.exports = {
  index (req, res) {
    db.temp.findAll().then((temps) => {
      res.send(temps);
    });
  },

  new (req, res) {
    const sentTemp = req.body;
    db.temp.findOrCreate({where: {
      heat: sentTemp.heat,
      cool: sentTemp.cool,
      noheat: sentTemp.noheat,
      nocool: sentTemp.nocool
    }})
    .spread((temp, created) => {
      res.send({created: created});
    });
  }
}
