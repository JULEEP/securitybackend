import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; // Adjust this if your sequelize instance is elsewhere

const Client = sequelize.define('Client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  projects: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Client
