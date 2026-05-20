import { notFound } from 'next/navigation';
import Link from 'next/link';
import Service from '@/models/Service';
import { getPageMetadata } from '@/lib/seo';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Home, 
  Briefcase, 
  Truck, 
  Box, 
  Wrench, 
  Warehouse 
} from 'lucide-react';
import FAQAccordion from '../../blog/[slug]/FAQAccordion';
import FAQschema from '@/components/Seo/FAQschema';
import HeadScript from '@/components/Seo/HeadScript';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/services/${slug}`;
  
  const [seoData, serviceRecord] = await Promise.all([
    getPageMetadata(path),
    Service.findOne({ where: { slug } })
  ]);

  if (!serviceRecord) return {};

  const service = serviceRecord.toJSON();

  const title = seoData?.title && seoData.title !== 'Services/[Slug] | Galaxy Movers Canada'
    ? seoData.title
    : `${service.name} | Galaxy Movers Canada`;

  const description = seoData?.description && seoData.description.length > 30
    ? seoData.description
    : service.description;

  return {
    title,
    description,
    keywords: seoData?.keywords || 'moving services, residential movers, office movers, storage',
    alternates: {
      canonical: seoData?.canonical_url || undefined,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: seoData?.og_image ? [{ url: seoData.og_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seoData?.og_image ? [seoData.og_image] : [],
    }
  };
}

// Helper to get matching icons
function getServiceIcon(slug) {
  const css = "h-10 w-10 text-red-600";
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

export default async function ServiceDetail({ params }) {
  const { slug } = await params;

  // Query service details from MySQL
  const serviceRecord = await Service.findOne({
    where: { slug }
  });

  if (!serviceRecord) {
    notFound();
  }

  const service = serviceRecord.toJSON();

  // Fetch optional SEO scripts for this specific page path
  const path = `/services/${slug}`;
  const seoData = await getPageMetadata(path);

  // Parse FAQs if present
  let faqs = [];
  if (service.faqs) {
    try {
      faqs = JSON.parse(service.faqs);
    } catch (e) {
      console.error('Error parsing service FAQs:', e);
    }
  }

  return (
    <article className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      {/* Dynamic Server-Side Header Script Injections */}
      <HeadScript html={seoData?.page_header} />
      
      {/* Render Schema-based JSON-LD FAQ Data */}
      <FAQschema faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-red-50/30 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-blue-50/20 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/services" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-red-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </Link>

        {/* Hero Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-4">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1 px-3.5 rounded-full inline-block">
              Service Specialty
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {service.name}
            </h1>
          </div>

          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100 shrink-0 self-start sm:self-center shadow-inner">
            {getServiceIcon(service.slug)}
          </div>
        </div>

        {/* Article Rich Text Content */}
        <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-headings:tracking-tight prose-a:text-red-600 hover:prose-a:text-red-700 font-medium">
          {/* Output long HTML text generated by Rich Text Editor */}
          <div dangerouslySetInnerHTML={{ __html: service.content }} />
        </div>

        {/* Optional Service-Specific FAQs Accordion */}
        {faqs.length > 0 && (
          <div className="pt-10 border-t border-gray-150 space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <FAQAccordion faqs={faqs} />
          </div>
        )}

        {/* Relocation CTA Promo Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 mt-16">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-gray-900">
              Ready to Book {service.name}?
            </h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed">
              Schedule your relocation appointment today and secure your locked-in flat rate.
            </p>
          </div>
          <Link 
            href="/book-appointment" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center shrink-0 w-full md:w-auto justify-center cursor-pointer"
          >
            <span>Book Appointment Now</span>
            <ArrowRight className="h-4.5 w-4.5 ml-2 stroke-[2.5]" />
          </Link>
        </div>

      </div>

      {/* Dynamic Server-Side Footer Script Injections */}
      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </article>
  );
}
