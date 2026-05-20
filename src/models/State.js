import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const State = sequelize.define('State', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'states',
  underscored: true
});

export default State;
