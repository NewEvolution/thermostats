'use strict';

const db = require('../models/');
const request = require('superagent');
const stateAbbrLength = 2;

const AUTHID = process.env.AUTHID;
const AUTHTOKEN = process.env.AUTHTOKEN;

module.exports = {
  // Full data dump of state or county
  detail (req, res) {
    let stateWhere = {};
    const state = req.params.state;
    if (state && state.length === stateAbbrLength) {
      stateWhere = {abbr: state.toUpperCase()};
    }
    let countyWhere = {};
    const county = req.params.county;
    if (county) {
      countyWhere = {name: county};
    }
    db.state.findAll({
      where: stateWhere,
      include: [{
        model: db.county,
        where: countyWhere,
        stateId: db.Sequelize.col('state.id'),
        include: [{
          model: db.temp,
          countyId: db.Sequelize.col('county.id')
        }]
      }]
    }).then((states) => {
      res.send(states);
    });
  },

  summary (req, res) {
    // Data summary by state or county
    let stateWhere = {};
    const state = req.params.state;
    if (state && state.length === stateAbbrLength) {
      stateWhere = {abbr: state.toUpperCase()};
    }
    let countyWhere = {};
    const county = req.params.county;
    if (county) {
      countyWhere = {name: county};
    }
    db.state.findAll({
      where: stateWhere,
      include: [{
        model: db.county,
        where: countyWhere,
        stateId: db.Sequelize.col('state.id'),
        include: [{
          model: db.temp,
          countyId: db.Sequelize.col('county.id')
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
        state.counties.forEach((county) => {
          county.temps.forEach((temp) => {
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
        delete state.dataValues.counties;
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
    const apiurl = `https://us-zipcode.api.smartystreets.com/lookup?auth-id=${AUTHID}&auth-token=${AUTHTOKEN}&zipcode=${zip}`
    request.get(apiurl).end((err, body) => {
      const created = {};
      created.state = created.county = created.temp = false;
      const response = {
        created: created,
        message: '',
        state: {},
        county: {},
        temp: {}
      };
      if (err) {
        throw err;
      } else {
        const data = JSON.parse(body.text)[0];
        if (data.hasOwnProperty('status')) {
          response.message = data.reason;
          res.send(response);
        } else {
          db.state.findOrCreate({
            where: {
              abbr: data.city_states[0].state_abbreviation
            }, defaults: {
              name: data.city_states[0].state
            }
          }).spread((state, crstate) => {
            created.state = crstate;
            db.county.findOrCreate({
              where: {
                name: data.zipcodes[0].county_name
              }, defaults: {
                stateId: state.id
              }
            }).spread((county, crcounty) => {
              if (crcounty) {
                state.addCounty(county);
              }
              created.county = crcounty;
              db.temp.findOrCreate({
                where: {
                  sessionId: req.sessionID
                }, defaults: {
                  heat: req.body.heat,
                  cool: req.body.cool,
                  noheat: req.body.noheat,
                  nocool: req.body.nocool,
                  countyId: county.id
                }
              })
              .spread((temp, crtemp) => {
                created.temp = crtemp;
                if (crtemp) {
                  county.addTemp(temp);
                }
                response.message = 'Success!'
                response.state = state;
                response.county = county;
                response.temp = temp;
                res.send(response);
              });
            });
          });
        }
      }
    });
  }
}
