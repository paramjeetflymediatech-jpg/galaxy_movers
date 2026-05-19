'use client';

import { MapPin, ArrowRight } from 'lucide-react';


export default function Cities() {
  const citiesList = [
    { name: 'Vancouver', province: 'British Columbia', code: 'BC' },
    { name: 'Toronto', province: 'Ontario', code: 'ON' },
    { name: 'Calgary', province: 'Alberta', code: 'AB' },
    { name: 'Montreal', province: 'Quebec', code: 'QC' },
    { name: 'Edmonton', province: 'Alberta', code: 'AB' },
    { name: 'Ottawa', province: 'Ontario', code: 'ON' },
    { name: 'Winnipeg', province: 'Manitoba', code: 'MB' },
    { name: 'Quebec City', province: 'Quebec', code: 'QC' }
  ];

  const handleScrollToQuote = (e) => {
    e.preventDefault();
    const elem = document.getElementById('quote-form');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="cities" className="bg-white py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Nationwide Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Coast to Coast Moving Services
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium">
            We provide local and long-distance moving solutions in every major metropolitan area across Canada.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {citiesList.map((city, idx) => (
            <div 
              key={idx}
              className="border border-gray-100 hover:border-red-200 bg-gray-50/50 hover:bg-white p-6 rounded-xl hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group flex items-center space-x-4"
            >
              <div className="bg-white border border-gray-100 group-hover:bg-red-50 text-gray-400 group-hover:text-red-600 p-3 rounded-lg transition-colors duration-300 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-gray-900 text-base leading-snug group-hover:text-red-600 transition-colors">
                  {city.name}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {city.province} ({city.code})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Banner Callout */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border border-gray-800">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Don\'t see your specific town or city listed?
            </h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed">
              No worries! We cover surrounding districts, counties, and minor municipalities coast to coast.
            </p>
          </div>
          <a 
            href="#quote-form" 
            onClick={handleScrollToQuote}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center shrink-0 w-full md:w-auto relative z-10 cursor-pointer"
          >
            <span>Contact Us Today</span>
            <ArrowRight className="h-4.5 w-4.5 ml-2 stroke-[2.5]" />
          </a>
        </div>

      </div>
    </section>
  );
}
