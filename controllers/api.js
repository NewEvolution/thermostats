'use strict';

const db = require('../models/');
const request = require('superagent');

module.exports = {
  index (req, res) {
    const stateP = new Promise();
    const areaP = new Promise();
    const tempP = new Promise();
    const promiseArr = [stateP, areaP, tempP];
    const stateArr = [];
    db.state.findAll().then((states) => {
      states.forEach((state, stateItr) => {
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
              tempP.resolve();
            });
          });
          areaP.resolve();
        });
      });
      stateP.resolve();
    });
    Promise.all(promiseArr).then((allArr) => {
      res.send(allArr);
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
