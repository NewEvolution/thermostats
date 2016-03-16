'use strict';

module.exports = (sequelize, DataTypes) => {
  const temp = sequelize.define('temp', {
    heat: DataTypes.INTEGER,
    cool: DataTypes.INTEGER,
    noheat: DataTypes.BOOL,
    nocool: DataTypes.BOOL
  }, {
    classMethods: {
      associate: (models) => {
        temp.belongsTo(models.area, {
          foreignkey: {
            allowNull: false
          }
        });
      }
    }
  });
  return temp;
};
