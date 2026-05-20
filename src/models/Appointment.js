import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Appointment = sequelize.define('Appointment', {
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
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'appointment_date'
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'time_slot'
  },
  moveSize: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'move_size'
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'appointments',
  underscored: true,
  timestamps: true
});

export default Appointment;
