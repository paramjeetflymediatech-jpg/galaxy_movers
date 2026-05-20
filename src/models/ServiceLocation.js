import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import Service from './Service.js';
import Location from './Location.js';

const ServiceLocation = sequelize.define('ServiceLocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Service,
      key: 'id'
    }
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Location,
      key: 'id'
    }
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
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'service_locations',
  underscored: true,
  timestamps: false
});

// Associations
Service.belongsToMany(Location, { through: ServiceLocation, foreignKey: 'service_id' });
Location.belongsToMany(Service, { through: ServiceLocation, foreignKey: 'location_id' });

ServiceLocation.belongsTo(Service, { foreignKey: 'service_id' });
ServiceLocation.belongsTo(Location, { foreignKey: 'location_id' });
Service.hasMany(ServiceLocation, { foreignKey: 'service_id' });
Location.hasMany(ServiceLocation, { foreignKey: 'location_id' });

export default ServiceLocation;
