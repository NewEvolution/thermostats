'use strict';

module.exports = (sequelize, DataTypes) => {
  const area = sequelize.define('area', {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING(64) // eslint-disable-line no-magic-numbers
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        area.hasMany(models.temp);
      }
    }
  });
  return area;
};
