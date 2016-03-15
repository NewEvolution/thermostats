'use strict';
module.exports = function(sequelize, DataTypes) {
  var area = sequelize.define('area', {
    code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return area;
};