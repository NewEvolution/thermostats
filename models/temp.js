'use strict';

module.exports = (sequelize, DataTypes) => {
  const temp = sequelize.define('temp', {
    sessionId: DataTypes.STRING(32), // eslint-disable-line no-magic-numbers
    heat: DataTypes.INTEGER,
    cool: DataTypes.INTEGER,
    noheat: DataTypes.BOOLEAN,
    nocool: DataTypes.BOOLEAN
  }, {
    timestamps: false
  });
  return temp;
};
