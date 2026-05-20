import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  google_review_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'testimonials',
  underscored: true,
  timestamps: true
});

export default Testimonial;
