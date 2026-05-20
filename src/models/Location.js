import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import State from './State.js';
import District from './District.js';

const Location = sequelize.define('Location', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  state_id: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: 'id'
    }
  },
  district_id: {
    type: DataTypes.INTEGER,
    references: {
      model: District,
      key: 'id'
    }
  }
}, {
  tableName: 'locations',
  underscored: true
});

State.hasMany(Location, { foreignKey: 'state_id' });
Location.belongsTo(State, { foreignKey: 'state_id' });

District.hasMany(Location, { foreignKey: 'district_id' });
Location.belongsTo(District, { foreignKey: 'district_id' });

export default Location;
