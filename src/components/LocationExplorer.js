'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Home, 
  Briefcase, 
  Navigation, 
  Package, 
  Hammer, 
  Warehouse, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function LocationExplorer() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');

  const [loading, setLoading] = useState({ 
    states: true, 
    districts: false, 
    cities: false, 
    services: false 
  });

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
      setSelectedDistrict('');
      setSelectedCityId('');
      setCities([]);
      setServices([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchCities(selectedDistrict);
      setSelectedCityId('');
      setServices([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedCityId) {
      fetchServices(selectedCityId);
    } else {
      setServices([]);
    }
  }, [selectedCityId]);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      if (data.success) {
        setStates(data.data);
      }
    } catch (e) { 
      console.error('Error fetching states:', e); 
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const fetchDistricts = async (stateId) => {
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const res = await fetch(`/api/districts?stateId=${stateId}`);
      const data = await res.json();
      if (data.success) {
        setDistricts(data.data);
      }
    } catch (e) { 
      console.error('Error fetching districts:', e); 
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchCities = async (districtId) => {
    setLoading(prev => ({ ...prev, cities: true }));
    try {
      const res = await fetch(`/api/locations?districtId=${districtId}`);
      const data = await res.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (e) { 
      console.error('Error fetching cities:', e); 
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const fetchServices = async (locationId) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      const res = await fetch(`/api/locations/services?locationId=${locationId}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (e) { 
      console.error('Error fetching services:', e); 
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const currentCity = cities.find(c => c.id == selectedCityId);

  // Map service slug to customized Lucide icon
  const getServiceIcon = (slug) => {
    switch (slug) {
      case 'residential-moving':
        return <Home className="h-6 w-6" />;
      case 'commercial-office-moves':
        return <Briefcase className="h-6 w-6" />;
      case 'long-distance-relocations':
        return <Navigation className="h-6 w-6" />;
      case 'professional-packing-services':
        return <Package className="h-6 w-6" />;
      case 'furniture-disassembly-assembly':
        return <Hammer className="h-6 w-6" />;
      case 'secure-storage-solutions':
        return <Warehouse className="h-6 w-6" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* Dropdown Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white border border-gray-150 rounded-3xl shadow-xl shadow-gray-100/50">
        
        {/* State / Province Select */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">
            1. Province / State
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <option value="">Choose Province...</option>
              {states.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
          </div>
        </div>

        {/* District / Region Select */}
        <div className={`space-y-2 transition-all duration-300 ${!selectedState ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">
            2. Region / District
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <option value="">Choose Region...</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
          </div>
        </div>

        {/* City Select */}
        <div className={`space-y-2 transition-all duration-300 ${!selectedDistrict ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">
            3. City / Town
          </label>
          <div className="relative">
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <option value="">Choose City...</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Status Box */}
        <div className="flex items-end">
          <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg text-white">
                <Search size={16} />
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-black leading-none mb-1">Coverage Status</span>
                <span className="block text-sm font-extrabold text-gray-800 leading-none">
                  {selectedCityId 
                    ? `${services.length} Moving Services` 
                    : selectedDistrict 
                    ? `${cities.length} Cities Found` 
                    : 'Awaiting Input'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Results Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!selectedCityId ? (
          <div className="col-span-full py-24 text-center bg-white border border-gray-150 rounded-3xl space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
              <MapPin size={32} className="text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-800 tracking-tight">Select a Location</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {!selectedState 
                  ? 'Select Province to start' 
                  : !selectedDistrict 
                  ? 'Select Region next' 
                  : 'Choose your City to explore services'}
              </p>
            </div>
          </div>
        ) : loading.services ? (
          <div className="col-span-full py-24 text-center bg-white border border-gray-150 rounded-3xl space-y-4 shadow-sm">
            <Loader2 className="h-8 w-8 text-red-600 animate-spin mx-auto" />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Scanning local moving crews...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white border border-gray-150 rounded-3xl space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
              <Navigation size={32} className="text-gray-300 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-800 tracking-tight">No Active Crews</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No moving services are mapped for {currentCity?.name} yet.</p>
            </div>
          </div>
        ) : (
          services.map((svc) => (
            <Link
              key={svc.id}
              href={`/${currentCity?.State?.slug || 'canada'}/${svc.slug}-in-${currentCity?.slug}`}
              className="group relative bg-white border border-gray-100 hover:border-red-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-bl-[60px] -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-5">
                <div className="bg-red-50 text-red-600 p-3.5 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getServiceIcon(svc.slug)}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-snug group-hover:text-red-600 transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
                    Available in {currentCity?.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-3">
                  {svc.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  Book Moving Crew <ArrowRight size={12} />
                </span>
                <div className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center group-hover:bg-red-650 group-hover:border-red-600 group-hover:text-white transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
