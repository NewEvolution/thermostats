'use strict';

const db = require('../models/');
const request = require('superagent');
const stateAbbrLength = 2;
const zipCodeLength = 5;

module.exports = {
  // Full data dump of every key:value on selected search items
  index (req, res) {
    let stateWhere = {};
    if (req.params.state.length === stateAbbrLength) {
      stateWhere = {abbr: req.params.state.toUpperCase()};
    }
    let areaWhere = {};
    if (req.params.area && req.params.area.length === zipCodeLength) {
      areaWhere = {code: parseInt(req.params.area)};
    }
    db.state.findAll({
      where: stateWhere,
      include: [{
        model: db.area,
        where: areaWhere,
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

  detail (req, res) {
    let stateWhere = {};
    if (req.params.state.length === stateAbbrLength) {
      stateWhere = {abbr: req.params.state.toUpperCase()};
    }
    let areaWhere = {};
    if (req.params.area && req.params.area.length === zipCodeLength) {
      areaWhere = {code: parseInt(req.params.area)};
    }
    db.state.findAll({
      where: stateWhere,
      include: [{
        model: db.area,
        where: areaWhere,
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
