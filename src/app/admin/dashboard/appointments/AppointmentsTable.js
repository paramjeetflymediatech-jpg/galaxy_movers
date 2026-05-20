'use client';

import { useState } from 'react';
import { Search, Calendar, Phone, Mail, MapPin, X, FileText, CheckCircle, Clock, Box, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AppointmentsTable({ initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Search filtering logic
  const filteredAppointments = appointments.filter((appt) => {
    const query = searchQuery.toLowerCase();
    return (
      appt.fullName.toLowerCase().includes(query) ||
      appt.email.toLowerCase().includes(query) ||
      appt.movingFrom.toLowerCase().includes(query) ||
      appt.movingTo.toLowerCase().includes(query) ||
      appt.phone.includes(query) ||
      appt.moveSize.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error while updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border border-green-150';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-150';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-150';
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-150';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search bookings by name, route, move size..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 pl-11 pr-4 rounded-xl focus:outline-none transition-all font-semibold"
        />
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">No appointment bookings found matching your query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="py-3 px-4">Customer Info</th>
                <th className="py-3 px-4">Moving Route</th>
                <th className="py-3 px-4">Scheduled Date / Time</th>
                <th className="py-3 px-4">Move Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-55/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">
                    <span className="block leading-snug">{appt.fullName}</span>
                    <span className="block text-[10px] text-gray-450 font-bold mt-0.5 uppercase">
                      Appt #{appt.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span className="truncate max-w-[180px]">{appt.movingFrom} &rarr; {appt.movingTo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-flex items-center text-xs font-bold">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-red-600" />
                        {formatDate(appt.appointmentDate)}
                      </span>
                      <span className="inline-flex items-center text-[11px] text-gray-450 font-bold">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-450" />
                        {appt.timeSlot.split(' ')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <span className="inline-flex items-center text-xs bg-gray-50 border border-gray-100 py-1 px-2.5 rounded-lg">
                      <Box className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {appt.moveSize}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center text-[10px] uppercase font-extrabold tracking-wider py-1 px-2.5 rounded-full ${getStatusBadge(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedAppointment(appt)}
                      type="button"
                      className="bg-red-55 hover:bg-red-600 text-red-650 hover:text-white py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Detail Modal overlay */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative border-b border-gray-800">
              <div className="flex items-center space-x-2.5">
                <div className="bg-red-600 p-1.5 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  Booking Details #{selectedAppointment.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                type="button"
                className="hover:text-red-500 transition-colors p-1.5 hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Customer and Status row */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Customer
                  </span>
                  <span className="text-lg font-black text-gray-900 block leading-tight">
                    {selectedAppointment.fullName}
                  </span>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">
                    Current Status
                  </span>
                  <span className={`inline-flex items-center text-[10px] uppercase font-extrabold tracking-wider py-1 px-2.5 rounded-full ${getStatusBadge(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Phone Number
                  </span>
                  <a href={`tel:${selectedAppointment.phone}`} className="text-sm font-bold text-red-600 hover:underline">
                    {selectedAppointment.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Email Address
                  </span>
                  <a href={`mailto:${selectedAppointment.email}`} className="text-sm font-bold text-red-600 hover:underline break-all">
                    {selectedAppointment.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Move Size
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {selectedAppointment.moveSize}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Preferred Window
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {selectedAppointment.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Scheduled Date
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {formatDate(selectedAppointment.appointmentDate)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Booking Date
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {formatDate(selectedAppointment.createdAt)}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Moving From
                  </span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedAppointment.movingFrom}</span>
                </div>
                <div className="text-red-500 font-black text-base shrink-0">&rarr;</div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Moving To
                  </span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedAppointment.movingTo}</span>
                </div>
              </div>

              {/* Special instructions */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                  Customer Notes & Inventory
                </span>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-sm font-medium text-gray-600 leading-relaxed min-h-[80px]">
                  {selectedAppointment.notes || 'No special requirements specified.'}
                </div>
              </div>

              {/* UPDATE STATUS ACTION GROUP */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-widest block">
                  Update Scheduling Status
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      disabled={updatingId !== null}
                      onClick={() => handleStatusChange(selectedAppointment.id, st)}
                      type="button"
                      className={`py-2 px-1 rounded-xl text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition-all ${
                        selectedAppointment.status === st
                          ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                          : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                type="button"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
