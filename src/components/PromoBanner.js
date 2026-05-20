import { Zap, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="bg-gray-900 py-16 lg:py-20 text-white relative overflow-hidden border-t border-b border-gray-800">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Shimmer Badge */}
        <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-500/30 rounded-full px-4.5 py-2 text-red-400 font-extrabold text-xs uppercase tracking-wider mx-auto shadow-inner shadow-red-500/5">
          <Zap className="h-4 w-4 fill-red-400 animate-pulse mr-1" />
          <span>⚡ Limited Time Offer - Book Now & Save 15%</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
          Moving Soon? Let Galaxy Movers Handle Everything.
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Book your moving appointment online today and experience stress-free moving with Canada\'s most trusted professionals. Secure packing, modern fleets, and guaranteed flat rates.
        </p>

        {/* Perks Checklist */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-gray-300">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-red-500 mr-2" />
            <span>Book Online in 2 Minutes</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-red-500 mr-2" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-red-500 mr-2" />
            <span>Same-Day Service Available</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-8 rounded-lg shadow-xl shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base cursor-pointer group"
          >
            <span>Book Your Move Today</span>
            <ArrowRight className="h-5 w-5 ml-2.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
