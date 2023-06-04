'use strict';
import { v4 as uuid } from 'uuid';
import { Model, CreationOptional, Optional, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection';

export type AuthorAttributes = {
  id: string;
  firstname: string;
  middlename?: string;
  authorUniqueReference: string;
  lastname: string;
  address?: string;
  contactNumber: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

// when creating an instance of the model (such as using Model.create()).
export type AuthorCreationAttributes = Optional<AuthorAttributes, 'middlename' | 'address'>;

class AuthorModel extends Model<AuthorAttributes, AuthorCreationAttributes> {
  declare id: string;
  declare firstname: string;
  declare authorUniqueReference: string;
  // {middlename} can be undefined during creation
  declare middlename: CreationOptional<string>;
  declare lastname: string;
  // {address} can be undefined during creation
  declare address: CreationOptional<string>;
  declare contactNumber: string;
  declare emailAddress: string;

  declare createdAt: Date;
  declare updatedAt: CreationOptional<Date>;
}

AuthorModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    authorUniqueReference: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    middlename: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    contactNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    emailAddress: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'authors', modelName: 'Author' },
);

export default AuthorModel;
