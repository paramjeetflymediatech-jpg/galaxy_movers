import Link from 'next/link';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import LocationExplorer from '@/components/LocationExplorer';
import { MapPin, Phone } from 'lucide-react';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/locations');
  if (!seoData) return { title: 'Moving Locations | Galaxy Movers Canada' };

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

export default async function LocationsPage() {
  const seoData = await getPageMetadata('/locations');

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
          <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-red-50 text-red-600 text-xs font-extrabold uppercase tracking-widest">
            <MapPin size={14} className="animate-pulse" />
            <span>National Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-none">
            Find Moving Crews <br />
            <span className="text-red-650">Across Canada</span>
          </h1>
          <div className="w-16 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Select your Province, Region, and City to explore specialized residential, commercial, packing, and storage services in your local neighborhood.
          </p>
        </div>
      </section>

      {/* Dynamic Location Explorer Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationExplorer />
        </div>
      </section>

      {/* National Service Callout Banner */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border border-gray-800">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            <div className="space-y-3 text-center md:text-left relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Moving between provinces or remote regions?
              </h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed max-w-lg">
                Galaxy Movers connects remote municipalities and rural townships coast to coast. Contact our dispatch desk to arrange long-haul transit.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10 shrink-0">
              <a 
                href="tel:18005550199" 
                className="bg-gray-805 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl border border-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 text-red-500" />
                <span>1-800-555-0199</span>
              </a>
              <Link 
                href="/book-appointment" 
                className="bg-red-650 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-red-600/30 transition-colors text-sm flex items-center justify-center cursor-pointer"
              >
                <span>Book Appointment</span>
              </Link>
            </div>
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
