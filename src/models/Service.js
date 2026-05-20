import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  faqs: {
    type: DataTypes.TEXT, // Stored as serialized JSON string
    allowNull: true
  }
}, {
  tableName: 'services',
  underscored: true,
  timestamps: true
});

export default Service;
