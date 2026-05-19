import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  movingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'moving_date'
  },
  movingFrom: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'moving_from'
  },
  movingTo: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'moving_to'
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'completed', 'cancelled'),
    defaultValue: 'new'
  }
}, {
  tableName: 'leads',
  underscored: true,
  timestamps: true
});

export default Lead;
