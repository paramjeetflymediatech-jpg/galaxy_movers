import { Users, Receipt, ShieldAlert, Clock, Headset, Truck } from 'lucide-react';

export default function WhyUs() {
  const benefits = [
    {
      icon: <Users className="h-6 w-6 text-red-500" />,
      title: 'Experienced Movers',
      description: 'Our moving crews are highly trained, background-checked, and have years of hands-on expertise handling complex heavy assets.'
    },
    {
      icon: <Receipt className="h-6 w-6 text-red-500" />,
      title: 'Transparent Pricing',
      description: 'Zero hidden fees. We provide clear, all-inclusive flat rates or simple hourly terms with upfront binding contracts.'
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
      title: 'Safe & Secure Handling',
      description: 'Premium thick furniture pads, heavy elastic wraps, and specialty boxes protect your fragile belongings at every step.'
    },
    {
      icon: <Clock className="h-6 w-6 text-red-500" />,
      title: 'On-Time Delivery',
      description: 'We respect your schedule. Our dispatchers guarantee strict arrival windows and fast, direct routes between cities.'
    },
    {
      icon: <Headset className="h-6 w-6 text-red-500" />,
      title: '24/7 Customer Support',
      description: 'Always here when you need us. Speak directly to our moving dispatch coordinators day or night during transit.'
    },
    {
      icon: <Truck className="h-6 w-6 text-red-500" />,
      title: 'Fully Equipped Trucks',
      description: 'Modern, clean fleet fitted with pneumatic liftgates, hydraulic ramps, specialized straps, and heavy moving dollies.'
    }
  ];

  return (
    <section id="why-us" className="bg-gray-900 text-white py-20 lg:py-28 relative scroll-mt-20">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-500 font-extrabold text-xs uppercase tracking-widest bg-red-950/40 border border-red-900/30 py-1.5 px-3.5 rounded-full inline-block">
            Why Galaxy Movers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Setting the Standard in Canadian Moving
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-400 font-medium">
            Over the years, we have optimized our checklists, training routines, and dispatch tech to deliver a pristine moving experience.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx}
              className="bg-gray-800/40 border border-gray-800 hover:border-red-900/50 p-8 rounded-2xl transition-all duration-300 hover:bg-gray-800/70 hover:shadow-2xl hover:shadow-red-950/10 group"
            >
              <div className="bg-gray-800 text-red-500 p-4 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <div className="group-hover:scale-105 transition-transform duration-300">
                  {benefit.icon}
                </div>
              </div>
              
              <h3 className="font-extrabold text-white text-xl mt-5 mb-2.5 tracking-tight group-hover:text-red-400 transition-colors">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
