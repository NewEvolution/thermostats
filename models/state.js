'use strict';
module.exports = function(sequelize, DataTypes) {
  var state = sequelize.define('state', {
    name: DataTypes.VARCHAR(20),
    abbr: DataTypes.VARCHAR(2)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return state;
};