'use strict'

const db = require('../models/');
const request = require('superagent');

module.exports = {
  index (req, res) {
    db.temp.findAll().then((temps) => {
      res.send(temps);
    });
  },

  new (req, res) {
    const zip = req.body.zip;
    const zipapi = `https://api.zippopotam.us/us/${zip}`
    request.get(zipapi).end((err, body) => {
      if (err) throw err;
      db.temp.findOrCreate({
        where: {
          sessionID: req.sessionID
        }, defaults: {
          heat: req.body.heat,
          cool: req.body.cool,
          noheat: req.body.noheat,
          nocool: req.body.nocool
        }
      })
      .spread((temp, created) => {
        res.send({created: created, body: body});
      });
    });
  }
}
