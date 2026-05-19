'use client';

import { ArrowRight, Phone, ShieldCheck, Zap } from 'lucide-react';


export default function Hero() {
  const handleScrollToQuote = (e) => {
    e.preventDefault();
    const elem = document.getElementById('quote-form');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-red-950 text-white py-24 lg:py-32 flex items-center">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-500/20 rounded-full px-4 py-1.5 text-red-400 font-bold text-xs uppercase tracking-wider mx-auto lg:mx-0">
              <Zap className="h-3.5 w-3.5 fill-red-400" />
              <span>⚡ Canada\'s #1 Relocation Specialists</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
              Stress-Free Moving <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Across Canada
              </span>
            </h1>

            {/* Descriptive paragraph */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Moving your home or business? Rely on Galaxy Movers for secure packing, efficient transport, and flat rates. Coast-to-coast coverage with a licensed, insured moving crew.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#quote-form"
                onClick={handleScrollToQuote}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-xl shadow-red-600/20 hover:shadow-red-600/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer text-base group"
              >
                <span>Book Your Move</span>
                <ArrowRight className="h-5 w-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:18005551234"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center hover:border-white/40 cursor-pointer text-base"
              >
                <Phone className="h-5 w-5 mr-2.5 text-red-500" />
                <span>Call (800) 555-1234</span>
              </a>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-700/50 max-w-lg sm:max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-300">Fully Insured</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Zap className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-300">Same-Day Availability</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center space-x-2.5 justify-center sm:justify-start">
                <span className="text-sm font-extrabold text-red-500">10,000+</span>
                <span className="text-sm font-semibold text-gray-300">Moves Completed</span>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Visual Glass Box Wrapper */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900/55 p-3.5">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-gray-800 to-gray-700 relative">
                <img 
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800" 
                  alt="Professional movers packing a truck" 
                  className="object-cover w-full h-full opacity-90 transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full">
                    Modern Fleet
                  </span>
                  <p className="text-white font-bold text-lg mt-2 leading-snug">
                    Fully-equipped moving trucks stationed across Canada.
                  </p>
                </div>
              </div>
            </div>

            {/* Absolute Badges for depth */}
            <div className="absolute -top-6 -left-6 bg-red-600 text-white py-4 px-6 rounded-xl shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <span className="block text-2xl font-black">15% OFF</span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-red-200">
                Book This Week
              </span>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 py-3.5 px-5 rounded-xl shadow-xl flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black leading-none">Best Price</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  Guarantee
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
