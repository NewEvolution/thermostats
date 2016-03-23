'use strict';

const db = require('../models/');
const request = require('superagent');

module.exports = {
  index (req, res) {
    let stateCount = 0;
    const stateArr = [];
    db.state.findAll().then((states) => {
      states.forEach((state, stateItr) => {
        stateCount = stateCount < stateItr ? stateItr : stateCount;
        stateArr[stateItr] = state.dataValues;
        stateArr[stateItr].areas = [];
        db.area.findAll({
          where: {
            stateId: state.dataValues.id
          }
        }).then((areas) => {
          areas.forEach((area, areaItr) => {
            stateArr[stateItr].areas[areaItr] = area.dataValues;
            stateArr[stateItr].areas[areaItr].temps = [];
            db.temp.findAll({
              where: {
                areaId: area.dataValues.id
              }
            }).then((temps) => {
              temps.forEach((temp, tempItr) => {
                stateArr[stateItr].areas[areaItr].temps[tempItr] = temp.dataValues;
              });
              if (stateCount === stateItr) res.send(stateArr);
            });
          });
        });
      });
    });
  },

  new (req, res) {
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
