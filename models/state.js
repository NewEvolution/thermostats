'use strict';

module.exports = (sequelize, DataTypes) => {
  const state = sequelize.define('state', {
    name: DataTypes.STRING(20), // eslint-disable-line no-magic-numbers
    abbr: DataTypes.STRING(2) // eslint-disable-line no-magic-numbers
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        state.hasMany(models.area);
      }
    }
  });
  return state;
};
