'use strict'

const db = require('../models/');
const request = require('superagent');

module.exports = {
  index (req, res) {
    db.state.findAll().then((states) => {
      res.send(states);
    });
  },

  new (req, res) {
    const zip = req.body.zip;
    const zipapi = `https://api.zippopotam.us/us/${zip}`
    request.get(zipapi).end((err, body) => {
      if (err) {
        if (err.status === 404) { // eslint-disable-line no-magic-numbers
          res.send({
            created: false,
            validzip: false
          });
        } else {
          throw err;
        }
      }
      const data = JSON.parse(body.text).places[0]; // eslint-disable-line no-magic-numbers
      const created = {};
      db.state.findOrCreate({
        where: {
          abbr: data['state abbreviation']
        }, defaults: {
          name: data.state
        }
      }).spread((state, crstate) => {
        created.state = crstate;
        db.area.findOrCreate({
          where: {
            code: zip,
            name: data['place name']
          }, defaults: {
            stateId: state.id
          }
        }).spread((area, crarea) => {
          created.area = crarea;
          if (crarea) {
            state.setAreas(area);
          }
          db.temp.findOrCreate({
            where: {
              sessionId: req.sessionID
            }, defaults: {
              heat: req.body.heat,
              cool: req.body.cool,
              noheat: req.body.noheat,
              nocool: req.body.nocool,
              areaId: area.id
            }
          })
          .spread((temp, crtemp) => {
            created.temp = crtemp;
            if (crtemp) {
              area.setTemps(temp);
            }
            res.send({
              created: created,
              state: state,
              area: area,
              temp: temp
            });
          });
        });
      });
    });
  }
}
