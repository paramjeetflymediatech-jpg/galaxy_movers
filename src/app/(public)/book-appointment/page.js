import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import AppointmentForm from './AppointmentForm';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/book-appointment');
  if (!seoData) return { title: 'Book Appointment | Galaxy Movers Canada' };

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

export default async function BookAppointmentPage() {
  const seoData = await getPageMetadata('/book-appointment');

  return (
    <div className="bg-white min-h-screen py-16 lg:py-24 relative overflow-hidden">
      {/* Page-specific Header Script Injections */}
      <HeadScript html={seoData?.page_header} />

      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-50/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Online Scheduling
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Schedule Your Moving Date
          </h1>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium leading-relaxed">
            Secure your premium relocations crew. Choose your preferred day and time slot, and our logistics manager will verify availability within 15 minutes.
          </p>
        </div>

        {/* Embedded Client-side interactive booking form */}
        <AppointmentForm />

      </div>

      {/* Page-specific Footer Script Injections */}
      {seoData?.page_footer && (
        <div dangerouslySetInnerHTML={{ __html: seoData.page_footer }} />
      )}
    </div>
  );
}
