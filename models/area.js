'use strict';

module.exports = (sequelize, DataTypes) => {
  const area = sequelize.define('area', {
    code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        area.belongsTo(models.state, {
          foreignKey: {
            allowNull: false
          }
        });
        area.hasMany(models.temp);
      }
    }
  });
  return area;
};
