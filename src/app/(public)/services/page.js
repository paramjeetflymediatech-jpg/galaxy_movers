import Link from 'next/link';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import Service from '@/models/Service';
import { 
  Home, 
  Briefcase, 
  Truck, 
  Box, 
  Wrench, 
  Warehouse, 
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle
} from 'lucide-react';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/services');
  if (!seoData) return { title: 'Our Moving Services | Galaxy Movers Canada' };

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

// Helper to resolve an icon based on service slug
function getServiceIcon(slug) {
  const css = "h-8 w-8 text-red-600 transition-transform group-hover:scale-110 duration-300";
  switch (slug) {
    case 'residential-moving':
      return <Home className={css} />;
    case 'commercial-office-moves':
      return <Briefcase className={css} />;
    case 'long-distance-relocations':
      return <Truck className={css} />;
    case 'professional-packing-services':
      return <Box className={css} />;
    case 'furniture-disassembly-assembly':
      return <Wrench className={css} />;
    case 'secure-storage-solutions':
      return <Warehouse className={css} />;
    default:
      return <Truck className={css} />;
  }
}

export default async function ServicesPage() {
  const seoData = await getPageMetadata('/services');
  let services = [];

  try {
    services = await Service.findAll({ order: [['name', 'ASC']] });
  } catch (err) {
    console.error('Error loading services list for public page:', err);
  }

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Page-specific Scripts */}
      <HeadScript html={seoData?.page_header} />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/40 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-0 w-[450px] h-[450px] bg-blue-50/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Hero Header Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="max-w-3xl mx-auto space-y-5">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-4 rounded-full inline-block">
            Our Relocation Specialties
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
            Professional Moving <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Services Across Canada
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            From local apartment moves to cross-provincial commercial logistics, we deliver peace of mind and sub-millimeter organization.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div 
              key={svc.id} 
              className="group bg-white border border-gray-150 rounded-3xl p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600 group-hover:to-red-800 transition-all duration-500"></div>
              
              <div className="space-y-6">
                {/* Icon wrapper */}
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all duration-300">
                  <div className="group-hover:text-white group-hover:[&_svg]:text-white">
                    {getServiceIcon(svc.slug)}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-red-600 transition-colors duration-250">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {svc.description || 'Professional, fully-insured relocation assistance tailored to your exact requirements.'}
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-gray-50 flex items-center justify-between">
                <Link 
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors group/btn cursor-pointer"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Galaxy Protected
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badging & Accents */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="bg-red-100 p-3.5 rounded-2xl shrink-0">
              <ShieldCheck className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-gray-900 text-base">Fully Licensed & Insured</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Your items are covered by comprehensive transit liability policies from departure to destination.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="bg-red-100 p-3.5 rounded-2xl shrink-0">
              <Star className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-gray-900 text-base">5-Star Relocation Crews</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Background-checked, experienced moving specialists dedicated to delivering a seamless moving day.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="bg-red-100 p-3.5 rounded-2xl shrink-0">
              <CheckCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-gray-900 text-base">Zero Hidden Fees Policy</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Clear, transparent pricing contracts with zero unexpected charges or surprise fuel margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Ready to Plan Your Next Move?
        </h2>
        <p className="text-gray-500 text-base font-medium max-w-xl mx-auto leading-relaxed">
          Lock in your preferred moving date with our crew. Select your details and book an appointment online in under 2 minutes.
        </p>
        <div className="pt-4">
          <Link 
            href="/book-appointment" 
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-4 px-8 rounded-2xl shadow-xl shadow-red-600/15 transition-all cursor-pointer"
          >
            <span>Book Appointment Now</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Page-specific Footer Scripts */}
      {seoData?.page_footer && (
        <div dangerouslySetInnerHTML={{ __html: seoData.page_footer }} />
      )}
    </div>
  );
}
