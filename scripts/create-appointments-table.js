import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import sequelize from '../src/lib/db.js';
import Appointment from '../src/models/Appointment.js';

async function main() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Sequelize connected successfully.');

    console.log('Syncing "appointments" table with model definition...');
    // sync() will create the table if it doesn't exist, or alter it if there are changes.
    await Appointment.sync({ alter: true });
    
    console.log('\n==================================================');
    console.log('✅ Table "appointments" has been verified/created!');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create/alter appointments table:', error);
    process.exit(1);
  }
}

main();
