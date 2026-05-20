'use client';

import { useState } from 'react';
import { Calendar, MapPin, Send, CheckCircle, Loader2, Clock, Box } from 'lucide-react';

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    appointmentDate: '',
    timeSlot: 'Morning (8:00 AM - 12:00 PM)',
    moveSize: '1 Bedroom Home',
    movingFrom: '',
    movingTo: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setIsSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        appointmentDate: '',
        timeSlot: 'Morning (8:00 AM - 12:00 PM)',
        moveSize: '1 Bedroom Home',
        movingFrom: '',
        movingTo: '',
        notes: ''
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {isSuccess ? (
        <div className="text-center py-16 space-y-6">
          <div className="bg-green-50 text-green-500 p-5 rounded-full w-fit mx-auto animate-bounce">
            <CheckCircle className="h-16 w-16" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900">Appointment Scheduled!</h3>
            <p className="text-sm text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">
              Your moving appointment request has been logged successfully. An administrator is verifying crew schedules and will email/call you to confirm the booking within 15 minutes.
            </p>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-red-600/15 transition-all duration-200 cursor-pointer text-sm"
          >
            Schedule Another Appointment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Address */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
              />
            </div>

            {/* Moving Date */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="appointmentDate" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Preferred Moving Date
              </label>
              <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                required
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Time Slot */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="timeSlot" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Preferred Time Window
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-850 appearance-none cursor-pointer"
                >
                  <option>Morning (8:00 AM - 12:00 PM)</option>
                  <option>Afternoon (12:00 PM - 4:00 PM)</option>
                  <option>Evening (4:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Move Size */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="moveSize" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Estimated Size of Move
              </label>
              <div className="relative flex items-center">
                <Box className="absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                <select
                  id="moveSize"
                  name="moveSize"
                  value={formData.moveSize}
                  onChange={handleChange}
                  className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-850 appearance-none cursor-pointer"
                >
                  <option>Studio Apartment</option>
                  <option>1 Bedroom Home</option>
                  <option>2 Bedroom Home</option>
                  <option>3 Bedroom Home</option>
                  <option>4+ Bedroom Home</option>
                  <option>Office / Commercial Move</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Moving From */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="movingFrom" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Moving From (City, Prov)
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                <input
                  id="movingFrom"
                  name="movingFrom"
                  type="text"
                  required
                  value={formData.movingFrom}
                  onChange={handleChange}
                  placeholder="e.g. Toronto, ON"
                  className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>

            {/* Moving To */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="movingTo" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Moving To (City, Prov)
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                <input
                  id="movingTo"
                  name="movingTo"
                  type="text"
                  required
                  value={formData.movingTo}
                  onChange={handleChange}
                  placeholder="e.g. Vancouver, BC"
                  className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Special Notes / Inventory Items
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="List any delicate cargo (e.g. piano, marble tables) or packing services needed..."
              rows="4"
              className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800 resize-none"
            ></textarea>
          </div>

          {/* Submit CTA */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-600/20 active:translate-y-0 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                <span>Booking Crew...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2.5" />
                <span>Confirm Moving Appointment</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
