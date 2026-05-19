import { Home, Briefcase, Navigation, Package, Hammer, Warehouse } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Home className="h-6 w-6 text-red-600" />,
      title: 'Residential Moving',
      description: 'Whether it is a cozy studio, a high-rise condo, or a spacious family home, our crew handles your personal belongings with extreme care.'
    },
    {
      icon: <Briefcase className="h-6 w-6 text-red-600" />,
      title: 'Commercial & Office Moves',
      description: 'Streamline your business relocation. We safely transport IT infrastructure, heavy machinery, office desks, and sensitive archives with zero downtime.'
    },
    {
      icon: <Navigation className="h-6 w-6 text-red-600" />,
      title: 'Long Distance Relocations',
      description: 'Reliable cross-provincial moving. Our structured freight networks and dedicated long-haul trucks connect communities coast to coast.'
    },
    {
      icon: <Package className="h-6 w-6 text-red-600" />,
      title: 'Professional Packing Services',
      description: 'Delegate the wrap and seal. We bring premium double-walled moving boxes, bubble sheets, packing paper, and specialty glass protection.'
    },
    {
      icon: <Hammer className="h-6 w-6 text-red-600" />,
      title: 'Furniture Disassembly & Assembly',
      description: 'Skip the Allen keys. Our team disassembles complex bed frames, modular wardrobes, and desks, then re-assembles them perfectly at your destination.'
    },
    {
      icon: <Warehouse className="h-6 w-6 text-red-600" />,
      title: 'Secure Storage Solutions',
      description: 'Flexible short and long-term storage vault options in our modern, climate-controlled, 24/7 CCTV protected national warehouse spaces.'
    }
  ];

  return (
    <section id="services" className="bg-gray-50 py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Complete Moving Solutions
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium">
            From local packing to cross-country transit, we offer fully customizable services tailored to your exact timelines and budget.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-100 hover:border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-50">
                <a 
                  href="#quote-form" 
                  className="text-red-600 hover:text-red-700 font-bold text-xs uppercase tracking-wider flex items-center group/btn"
                >
                  <span>Select Service</span>
                  <span className="ml-1.5 group-hover/btn:translate-x-1.5 transition-transform duration-200">
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
