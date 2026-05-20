import Link from 'next/link';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import { ShieldCheck, Truck, Clock, Award, Users, HeartHandshake, MapPin } from 'lucide-react';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/about');
  if (!seoData) return { title: 'About Us | Galaxy Movers Canada' };

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      canonical: seoData.canonical_url || undefined,
    },
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
  };
}

export default async function AboutPage() {
  const seoData = await getPageMetadata('/about');

  const stats = [
    { value: '15,000+', label: 'Successful Relocations' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '120+', label: 'Modern Moving Trucks' },
    { value: '250+', label: 'Expert Moving Crews' },
  ];

  const values = [
    {
      title: 'Safety & Protection First',
      description: 'Your belongings are fully insured and packed with premium materials, securing them for smooth travel.',
      icon: <ShieldCheck className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Absolute Transparency',
      description: 'We believe in honest, guaranteed flat-rate quotes without hidden fees, fuel surcharges, or surprises.',
      icon: <Award className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Reliable Timelines',
      description: 'Punctual arrivals and rapid cross-province transit schedules managed by seasoned routing coordinators.',
      icon: <Clock className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Customer-Centric Care',
      description: 'Our moving crews treat every client like family, accommodating special requests and delicate items with care.',
      icon: <HeartHandshake className="h-6 w-6 text-red-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Page-specific Header Script Injections */}
      <HeadScript html={seoData?.page_header} />

      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-red-50/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[500px] h-[300px] bg-gray-50 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Banner Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Who We Are
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-none">
            Relocating Canada With <span className="text-red-600">Care & Integrity</span>
          </h1>
          <div className="w-16 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Galaxy Movers is Canada's premier coast-to-coast relocation partner, delivering stress-free home, office, and logistics services.
          </p>
        </div>
      </section>

      {/* Company Story & Mission */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Our Story: From Local Relocations to National Transit
              </h2>
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <p className="text-gray-500 font-medium text-base leading-relaxed">
                Founded with a single truck and a dedication to premium customer support, Galaxy Movers was established to redefine the relocation experience in Canada. We recognized that moving is not just about moving cargo—it is about shifting lives, families, and dreams.
              </p>
              <p className="text-gray-500 font-medium text-base leading-relaxed">
                By investing in high-quality training, upfront flat-rate quoting, and a state-of-the-art fleet of GPS-tracked vans, we built a reputation for trust. Today, our network extends across all major Canadian provinces, from Vancouver and Calgary to Toronto and Montreal, delivering unmatched packing, storage, and transport solutions.
              </p>
              
              {/* Mission Highlight */}
              <div className="bg-red-50/50 border-l-4 border-red-600 p-6 rounded-r-2xl">
                <span className="block font-bold text-gray-900 text-sm mb-1 uppercase tracking-wider">Our Core Mission</span>
                <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                  To eliminate the stress of moving by executing every shipment with absolute reliability, transparent guaranteed rates, and a personal touch that leaves our customers smiling on arrival day.
                </p>
              </div>
            </div>

            {/* Illustrative Cards / Badges */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Modern Fleet</h3>
                <p className="text-xs text-gray-400 font-semibold">Equipped with heavy-duty air-ride suspension and safety restraints.</p>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Bonded Crews</h3>
                <p className="text-xs text-gray-400 font-semibold">Certified, background-screened, and trained packing professionals.</p>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Coast-to-Coast</h3>
                <p className="text-xs text-gray-400 font-semibold">Full coverage across all major Canadian municipalities and routes.</p>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Fully Insured</h3>
                <p className="text-xs text-gray-400 font-semibold">Comprehensive public liability and cargo insurance policies.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-gray-900 text-white py-16 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 block">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 lg:py-28 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
              Our Principles
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Values That Define Our Excellence
            </h2>
            <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="bg-red-50 p-3.5 rounded-xl w-fit">
                  {val.icon}
                </div>
                <h3 className="font-extrabold text-base text-gray-900">{val.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 text-white overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Schedule Your Next Move?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-semibold max-w-xl mx-auto leading-relaxed">
            Contact our coordinators today to lock in your moving date, select specialized moving packages, or secure a transparent flat-rate estimate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/book-appointment" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all duration-200 text-sm cursor-pointer w-full sm:w-auto"
            >
              Book Moving Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Page-specific Footer Script Injections */}
      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </div>
  );
}
