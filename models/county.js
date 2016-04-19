'use strict';

module.exports = (sequelize, DataTypes) => {
  const county = sequelize.define('county', {
    name: DataTypes.STRING(64) // eslint-disable-line no-magic-numbers
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        county.hasMany(models.temp);
      }
    }
  });
  return county;
};
