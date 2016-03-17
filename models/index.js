'use strict';

const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const localPostgresPort = 5432;
const POSTGRES_PORT = process.env.POSTGRES_PORT || localPostgresPort;
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_USER = process.env.POSTGRES_USER || 'ryan';
const POSTGRES_PASS = process.env.POSTGRES_PASS || '';
const POSTGRES_DATA = process.env.POSTGRES_DATA || 'thermostats'
const POSTGRES_AUTH = POSTGRES_USER ? `${POSTGRES_USER}:${POSTGRES_PASS}@` : '';
const POSTGRES_URL = `postgres://${POSTGRES_AUTH}${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATA}`;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(POSTGRES_URL);

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
