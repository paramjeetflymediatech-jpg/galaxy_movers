import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Seo = sequelize.define('Seo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  page_path: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  og_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  header_scripts: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  footer_scripts: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  canonical_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  og_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  og_description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'seo_metadata',
  underscored: true,
  timestamps: true
});

export default Seo;
