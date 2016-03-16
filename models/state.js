'use strict';

module.exports = (sequelize, DataTypes) => {
  const state = sequelize.define('state', {
    name: DataTypes.VARCHAR(20), // eslint-disable-line no-magic-numbers
    abbr: DataTypes.VARCHAR(2) // eslint-disable-line no-magic-numbers
  }, {
    classMethods: {
      associate: (models) => {
        state.hasMany(models.area);
      }
    }
  });
  return state;
};
