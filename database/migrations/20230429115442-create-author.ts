'use strict';
/** @type {import('sequelize-cli').Migration} */

import type { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.createTable('authors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUIDV4,
      },
      firstname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authorUniqueReference: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      middlename: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lastname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      contactNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      emailAddress: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('authors');
  },
};
