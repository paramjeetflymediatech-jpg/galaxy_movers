import { Shield, Sparkles, DollarSign, Globe } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: 'Licensed & Insured',
      description: 'Fully protected assets. Your valuables are secure with our bonded and background-checked moving crews.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-red-600" />,
      title: 'Same Day Moving',
      description: 'Urgent scheduling support. Relocate promptly when last-minute schedule shifts disrupt your plans.'
    },
    {
      icon: <DollarSign className="h-6 w-6 text-red-600" />,
      title: 'Affordable Pricing',
      description: 'Transparent flat quotes. Rest easy with zero hidden costs, premium surcharges, or surprises.'
    },
    {
      icon: <Globe className="h-6 w-6 text-red-600" />,
      title: 'Canada-Wide Service',
      description: 'Provinces connected coast to coast. Seamless transport between all major towns and cities.'
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-red-100 p-6 rounded-xl hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="bg-red-50 group-hover:bg-red-600 group-hover:text-white p-3.5 rounded-lg w-fit transition-colors duration-300">
                {/* Clone the icon element and change class color inside hover if needed, or rely on tailwind parent */}
                <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg mt-4 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
