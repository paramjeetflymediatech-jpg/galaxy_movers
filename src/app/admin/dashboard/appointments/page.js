import Appointment from '@/models/Appointment';
import AppointmentsTable from './AppointmentsTable';

export default async function AppointmentsManager() {
  let appointments = [];

  try {
    const list = await Appointment.findAll({
      order: [['createdAt', 'DESC']]
    });
    appointments = list.map(a => a.toJSON());
  } catch (err) {
    console.error('Error fetching appointments inside AppointmentsManager:', err);
  }

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Booked Appointments Tracker
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Review, coordinate, and update statuses of scheduled moving appointments.
        </p>
      </div>

      {/* Appointments interactive table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 overflow-hidden">
        <AppointmentsTable initialAppointments={appointments} />
      </div>
    </div>
  );
}
