'use strict';

const db = require('../models/');
const request = require('superagent');

module.exports = {
  // Full data dump, all states, areas & temps hierarchically
  index (req, res) {
    db.state.findAll({
      include: [{
        model: db.area,
        stateId: db.Sequelize.col('state.id'),
        include: [{
          model: db.temp,
          areaId: db.Sequelize.col('area.id')
        }]
      }]
    }).then((states) => {
      res.send(states);
    });
  },

  states (req, res) {
    db.state.findAll({
      include: [{
        model: db.area,
        stateId: db.Sequelize.col('state.id'),
        include: [{
          model: db.temp,
          areaId: db.Sequelize.col('area.id')
        }]
      }]
    }).then((states) => {
      let heat,
          cool,
          heatItr,
          coolItr,
          noheat,
          nocool;
      states.forEach((state) => {
        heat = cool = heatItr = coolItr = noheat = nocool = 0;
        state.areas.forEach((area) => {
          area.temps.forEach((temp) => {
            if (temp.noheat) {
              ++noheat;
            } else {
              heat += temp.heat;
              ++heatItr;
            }
            if (temp.nocool) {
              ++nocool;
            } else {
              cool += temp.cool;
              ++coolItr;
            }
          });
        });
        heat = heat / heatItr;
        cool = cool / coolItr;
        delete state.dataValues.areas;
        state.dataValues.data = {
          heat: heat,
          cool: cool,
          noheat: noheat,
          nocool: nocool
        };
      });
      res.send(states);
    });
  },

  new (req, res) {
    const noheat = req.body.noheat;
    const nocool = req.body.nocool;
    if (noheat === 'true' || noheat === true) req.body.heat = null;
    if (nocool === 'true' || nocool === true) req.body.cool = null;
    const zip = req.body.zip;
    const zipapi = `https://api.zippopotam.us/us/${zip}`
    request.get(zipapi).end((err, body) => {
      if (err) {
        if (err.status === 404) { // eslint-disable-line no-magic-numbers
          res.send({
            validzip: false,
            created: false
          });
        } else {
          throw err;
        }
      } else {
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
            if (crarea) {
              state.addArea(area);
            }
            created.area = crarea;
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
                area.addTemp(temp);
              }
              res.send({
                validzip: true,
                created: created,
                state: state,
                area: area,
                temp: temp
              });
            });
          });
        });
      }
    });
  }
}
