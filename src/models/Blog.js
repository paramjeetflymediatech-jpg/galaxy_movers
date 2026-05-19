import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Admin'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  faqs: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'blogs',
  underscored: true,
  timestamps: true
});

export default Blog;
