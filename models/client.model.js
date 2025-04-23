import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      }
    });
  
    Client.associate = (models) => {
      Client.hasMany(models.Invoice, { foreignKey: 'clientId' });
    };
  
    return Client;
  };
  