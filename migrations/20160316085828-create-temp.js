'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('temps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      heat: {
        type: Sequelize.INTEGER
      },
      cool: {
        type: Sequelize.INTEGER
      },
      noheat: {
        type: Sequelize.BOOL
      },
      nocool: {
        type: Sequelize.BOOL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('temps');
  }
};