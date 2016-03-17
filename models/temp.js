'use strict';

module.exports = (sequelize, DataTypes) => {
  const temp = sequelize.define('temp', {
    sessionID: DataTypes.STRING(32), // eslint-disable-line no-magic-numbers
    heat: DataTypes.INTEGER,
    cool: DataTypes.INTEGER,
    noheat: DataTypes.BOOLEAN,
    nocool: DataTypes.BOOLEAN
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
