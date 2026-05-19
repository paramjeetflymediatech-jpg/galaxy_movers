'use client';

import { useState } from 'react';
import { Calendar, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    movingDate: '',
    movingFrom: '',
    movingTo: '',
    details: ''
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
      const res = await fetch('/api/leads', {
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
        movingDate: '',
        movingFrom: '',
        movingTo: '',
        details: ''
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="quote-form" className="bg-gray-50 py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Info copy */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
              Free Estimate
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Get Your Free Moving Quote in 60 Seconds
            </h2>
            
            <div className="w-12 h-1 bg-red-600 mx-auto lg:mx-0 rounded-full"></div>
            
            <p className="text-base text-gray-500 font-medium leading-relaxed">
              Plan your moving budget with peace of mind. Fill out our simplified quotes form, and our regional routing managers will draft an customized schedule and flat estimate for you immediately.
            </p>

            <ul className="space-y-3.5 text-sm font-semibold text-gray-700">
              <li className="flex items-center justify-center lg:justify-start">
                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mr-3.5 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span>Best Price Guarantee &bull; Underwritten Terms</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mr-3.5 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span>Same-Day / Last-Minute Availability</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mr-3.5 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span>Fully Protected & Insurance Bonded Cargo</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Interactive Quote Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              
              {isSuccess ? (
                // Success card representation
                <div className="text-center py-12 space-y-6">
                  <div className="bg-green-50 text-green-500 p-4 rounded-full w-fit mx-auto animate-bounce">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Thank You!</h3>
                    <p className="text-sm text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
                      Your quote request has been securely processed. One of our regional coordinators will call you back with an estimate within 15 minutes!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer text-sm"
                  >
                    Submit Another Quote
                  </button>
                </div>
              ) : (
                // Form entry representation
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-500">
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
                        className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-lg focus:outline-none transition-all font-semibold"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-lg focus:outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">
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
                        className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-lg focus:outline-none transition-all font-semibold"
                      />
                    </div>

                    {/* Moving Date */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="movingDate" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Moving Date
                      </label>
                      <div className="relative">
                        <input
                          id="movingDate"
                          name="movingDate"
                          type="date"
                          required
                          value={formData.movingDate}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Moving From */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="movingFrom" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Moving From (City, Prov)
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3.5 h-4 w-4 text-gray-400" />
                        <input
                          id="movingFrom"
                          name="movingFrom"
                          type="text"
                          required
                          value={formData.movingFrom}
                          onChange={handleChange}
                          placeholder="Toronto, ON"
                          className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-10 pr-4 rounded-lg focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    {/* Moving To */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="movingTo" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Moving To (City, Prov)
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3.5 h-4 w-4 text-gray-400" />
                        <input
                          id="movingTo"
                          name="movingTo"
                          type="text"
                          required
                          value={formData.movingTo}
                          onChange={handleChange}
                          placeholder="Vancouver, BC"
                          className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-10 pr-4 rounded-lg focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional details */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="details" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Additional Details
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Tell us about your moving needs (e.g. piano, assembly, number of rooms...)"
                      rows="3"
                      className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-lg focus:outline-none transition-all font-semibold resize-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-red-600/20 active:translate-y-0 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2.5" />
                        <span>Submit Quote Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
