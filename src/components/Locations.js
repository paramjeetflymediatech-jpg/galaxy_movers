'use client';

import { useState } from 'react';
import { MapPin, Search, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Locations() {
  const provinces = ['All Provinces', 'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba'];

  const locationsList = [
    // Ontario
    { name: 'Toronto', province: 'Ontario', code: 'ON', region: 'Greater Toronto Area' },
    { name: 'Ottawa', province: 'Ontario', code: 'ON', region: 'National Capital Region' },
    { name: 'Mississauga', province: 'Ontario', code: 'ON', region: 'Peel Region' },
    { name: 'Hamilton', province: 'Ontario', code: 'ON', region: 'Golden Horseshoe' },
    { name: 'Brampton', province: 'Ontario', code: 'ON', region: 'Peel Region' },
    { name: 'London', province: 'Ontario', code: 'ON', region: 'Southwestern Ontario' },
    
    // British Columbia
    { name: 'Vancouver', province: 'British Columbia', code: 'BC', region: 'Metro Vancouver' },
    { name: 'Victoria', province: 'British Columbia', code: 'BC', region: 'Vancouver Island' },
    { name: 'Surrey', province: 'British Columbia', code: 'BC', region: 'Metro Vancouver' },
    { name: 'Burnaby', province: 'British Columbia', code: 'BC', region: 'Metro Vancouver' },
    { name: 'Kelowna', province: 'British Columbia', code: 'BC', region: 'Okanagan Valley' },

    // Alberta
    { name: 'Calgary', province: 'Alberta', code: 'AB', region: 'Calgary Region' },
    { name: 'Edmonton', province: 'Alberta', code: 'AB', region: 'Edmonton Capital Region' },
    { name: 'Red Deer', province: 'Alberta', code: 'AB', region: 'Central Alberta' },
    { name: 'Lethbridge', province: 'Alberta', code: 'AB', region: 'Southern Alberta' },

    // Quebec
    { name: 'Montreal', province: 'Quebec', code: 'QC', region: 'Greater Montreal' },
    { name: 'Quebec City', province: 'Quebec', code: 'QC', region: 'Capitale-Nationale' },
    { name: 'Laval', province: 'Quebec', code: 'QC', region: 'Greater Montreal' },
    { name: 'Gatineau', province: 'Quebec', code: 'QC', region: 'National Capital Region' },

    // Manitoba
    { name: 'Winnipeg', province: 'Manitoba', code: 'MB', region: 'Winnipeg Capital Region' },
    { name: 'Brandon', province: 'Manitoba', code: 'MB', region: 'Westman Region' }
  ];

  const [activeProvince, setActiveProvince] = useState('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic based on active tab and search query
  const filteredLocations = locationsList.filter((loc) => {
    const matchesProvince = activeProvince === 'All Provinces' || loc.province === activeProvince;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch;
  });

  return (
    <section id="locations" className="bg-gray-50/50 py-20 lg:py-28 relative scroll-mt-20">
      {/* Background shapes */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-red-50/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Our Service Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Serving Major Cities Across Canada
          </h2>
          <div className="w-12 h-1 bg-red-650 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium leading-relaxed">
            Galaxy Movers operates a nationwide moving network. From local moves to long-distance cross-province shipping, select your location to schedule a move.
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Tab switchers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {provinces.map((prov) => (
                <button
                  key={prov}
                  onClick={() => setActiveProvince(prov)}
                  type="button"
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    activeProvince === prov
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                      : 'bg-white border border-gray-150 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>

            {/* Search filter input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search city or province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-150 focus:border-red-500 text-xs py-2.5 pl-10 pr-4 rounded-xl focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <p className="text-gray-400 font-bold text-sm">No service areas found matching your query.</p>
            <Link 
              href="/book-appointment" 
              className="text-red-600 hover:text-red-700 font-bold text-xs mt-2 inline-block hover:underline"
            >
              Contact our national helpline to verify coverage &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((loc, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-100 hover:border-red-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-red-50 text-red-650 p-2.5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] bg-gray-50 border border-gray-100 font-extrabold text-gray-400 uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {loc.code}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-red-600 transition-colors">
                      {loc.name}
                    </h3>
                    <span className="text-xs text-gray-450 font-bold tracking-wide uppercase">
                      {loc.region}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-50 mt-5 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-green-600 font-extrabold uppercase flex items-center tracking-wide">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Active Hub
                  </span>
                  <Link 
                    href="/book-appointment"
                    className="inline-flex items-center text-xs font-bold text-gray-400 group-hover:text-red-600 hover:underline transition-colors"
                  >
                    <span>Book Move</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Banner Callout */}
        <div className="mt-16 bg-gray-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border border-gray-800">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Planning a move to a different location?
            </h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed">
              Our crews manage moves between any communities in Canada, including rural municipalities and regional cities.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10 shrink-0">
            <a 
              href="tel:18005550199" 
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl border border-gray-750 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4 text-red-500" />
              <span>1-800-555-0199</span>
            </a>
            <Link 
              href="/book-appointment" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-red-600/30 transition-colors text-sm flex items-center justify-center cursor-pointer"
            >
              <span>Book Moving Date</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
