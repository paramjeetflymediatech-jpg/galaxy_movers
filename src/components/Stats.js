export default function Stats() {
  const stats = [
    { value: '2,833+', label: 'Successful Moves' },
    { value: '1,416+', label: 'Happy Customers' },
    { value: '14+', label: 'Moving Experts' },
    { value: '4+', label: 'Cities Served' }
  ];

  return (
    <section className="bg-red-600 text-white py-16 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`space-y-2 ${
                idx < stats.length - 1 ? 'lg:border-r lg:border-white/20' : ''
              }`}
            >
              <span className="block text-4xl sm:text-5xl font-extrabold tracking-tight">
                {stat.value}
              </span>
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-red-100">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
