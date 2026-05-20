import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import State from './State.js';

const District = sequelize.define('District', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: 'id'
    }
  }
}, {
  tableName: 'districts',
  underscored: true
});

State.hasMany(District, { foreignKey: 'state_id' });
District.belongsTo(State, { foreignKey: 'state_id' });

export default District;
