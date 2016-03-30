'use strict';

const POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://localhost:5432/thermostats';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(POSTGRES_URL);

const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'; // eslint-disable-line no-magic-numbers
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
