import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  Mail, 
  HelpCircle,
  Home,
  Briefcase,
  Navigation,
  Package,
  Hammer,
  Warehouse
} from 'lucide-react';
import State from '@/models/State';
import Location from '@/models/Location';
import Service from '@/models/Service';
import ServiceLocation from '@/models/ServiceLocation';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import FAQschema from '@/components/Seo/FAQschema';
import FAQAccordion from '../../blog/[slug]/FAQAccordion';
import {ABOUT} from '@/lib/constant';

export async function generateMetadata({ params }) {
  const { state, slug } = await params;
  const path = `/${state}/${slug}`;
  const seoData = await getPageMetadata(path);

  if (!seoData) {
    return { title: 'Moving Services | Galaxy Movers Canada' };
  }

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

export default async function DynamicPage({ params }) {
  const { state, slug } = await params;

  // 1. Verify State (Province) exists
  const stateDoc = await State.findOne({ where: { slug: state } });
  if (!stateDoc) {
    return notFound();
  }

  // 2. Fetch SEO scripts for this specific page path
  const path = `/${state}/${slug}`;
  const seoData = await getPageMetadata(path);

  // Case A: Handle Location-Specific Service Page (e.g. /alberta/residential-moving-in-calgary)
  if (slug.includes('-in-')) {
    const parts = slug.split('-in-');
    const serviceSlug = parts[0];
    const locationSlug = parts[1];

    const [service, location] = await Promise.all([
      Service.findOne({ where: { slug: serviceSlug } }),
      Location.findOne({
        where: { slug: locationSlug, state_id: stateDoc.id },
        include: [{ model: State, attributes: ['id', 'name', 'slug'] }]
      })
    ]);

    if (service && location) {
      const junction = await ServiceLocation.findOne({
        where: { service_id: service.id, location_id: location.id }
      });

      return (
        <ServiceInLocationPage 
          service={service} 
          location={location} 
          junction={junction} 
          seoData={seoData} 
        />
      );
    }
  }

  // Case B: Handle Standalone Service Page (e.g. /alberta/residential-moving)
  const service = await Service.findOne({ where: { slug } });
  if (service) {
    return (
      <ServiceDetailPage 
        service={service} 
        state={stateDoc} 
        seoData={seoData} 
      />
    );
  }

  // Case C: Handle Standalone Location Page (e.g. /alberta/calgary)
  const location = await Location.findOne({
    where: { slug, state_id: stateDoc.id },
    include: [{ model: State, attributes: ['id', 'name', 'slug'] }]
  });
  if (location) {
    return (
      <LocationDetailPage 
        location={location} 
        state={stateDoc}
        seoData={seoData} 
      />
    );
  }

  return notFound();
}

// --- SUB-COMPONENTS ---

// 1. Service in Specific Location Component (e.g. Residential Moving in Calgary)
async function ServiceInLocationPage({ service, location, junction, seoData }) {
  let faqs = [];
  if (junction?.faqs) {
    try {
      faqs = JSON.parse(junction.faqs);
    } catch (e) {
      console.error('Error parsing local FAQs:', e);
    }
  }
  if (faqs.length === 0 && service.faqs) {
    try {
      faqs = JSON.parse(service.faqs);
    } catch (e) {
      console.error('Error parsing master FAQs:', e);
    }
  }

  return (
    <article className="bg-white py-12 lg:py-20 relative overflow-hidden min-h-screen">
      {/* Dynamic Server-Side Header Script Injections */}
      <HeadScript html={seoData?.page_header} />
      
      {/* Render Schema-based JSON-LD FAQ Data */}
      <FAQschema faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} />

      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gray-50 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/locations" 
          className="inline-flex items-center text-xs font-extrabold text-gray-400 hover:text-red-650 mb-8 transition-colors group cursor-pointer uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Locations Finder</span>
        </Link>

        {/* Hero Meta Header */}
        <div className="pb-10 mb-12 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="text-red-650 font-extrabold text-[10px] uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
                Active Moving Center
              </span>
              <span className="text-gray-500 font-extrabold text-[10px] uppercase tracking-widest bg-gray-100 py-1.5 px-3.5 rounded-full inline-block">
                {location.State.name}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">
              {service.name} <span className="text-red-600">in {location.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
              {junction?.description || `Professional ${service.name.toLowerCase()} solutions tailored to the needs of the ${location.name} community.`}
            </p>
          </div>

          <div className="bg-red-50 text-red-600 p-5 rounded-3xl w-fit border border-red-100 shadow-sm shrink-0">
            {getServiceIcon(service.slug)}
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Rich Content Block */}
            <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-650 prose-li:text-gray-650 prose-strong:text-gray-900 prose-headings:tracking-tight font-medium">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight uppercase">Service Details & Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: junction?.content || service.content || `<p>Experience premium moving solutions with Galaxy Movers in ${location.name}. Our experienced crews manage everything from packing to secure transport.</p>` }} />
            </div>

            {/* Crew Guarantees Block */}
            <div className="bg-gray-50 border border-gray-150 rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-600" />
                <span>The Galaxy Movers Standard</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Licensed, Bonded & Cargo Insured Crews",
                  "Double-walled boxes & professional wrap",
                  "GPS-enabled transit tracking",
                  "Rigid transparent flat-rate pricing"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-white border border-gray-200 rounded-full p-1 text-green-600">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-600 font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            {faqs.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-red-650 animate-pulse" />
                  <span>Frequently Asked Questions in {location.name}</span>
                </h3>
                <FAQAccordion faqs={faqs} />
              </div>
            )}

          </div>

          {/* Sidebar Booking Card */}
          <div className="space-y-8 sticky top-28">
            <div className="bg-gray-900 text-white border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] text-red-500 uppercase tracking-widest font-black block">Get A Free Quote</span>
                  <h4 className="text-xl font-black">Book In {location.name}</h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Arrange your moving date online or talk to our dispatch team for an instant estimate.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <Link 
                    href="/book-appointment" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-red-650/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Calendar size={14} />
                    <span>Book Appointment</span>
                  </Link>

                  <a 
                    href={`tel:${ABOUT[0].phone[0]}`} 
                    className="w-full bg-gray-850 hover:bg-gray-800 border border-gray-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone size={14} className="text-red-500" />
                    <span>Call {ABOUT[0].phone[0]}</span>
                  </a>
                </div>

                <ul className="space-y-3 pt-6 border-t border-gray-800 text-[11px] text-gray-400">
                  <li className="flex items-center gap-2">
                    <Clock size={13} className="text-red-500" />
                    <span>Open 24/7 for support & scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={13} className="text-red-500" />
                    <span>{ABOUT[0].email[0]}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin size={13} className="text-red-500" />
                    <span>Crews stationed locally in {location.name}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Server-Side Footer Script Injections */}
      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </article>
  );
}

// 2. Standalone Service Detail Page (e.g. Residential Moving in Alberta)
async function ServiceDetailPage({ service, state, seoData }) {
  // Query all locations/cities in this province where the service is registered
  const serviceLocations = await ServiceLocation.findAll({
    where: { service_id: service.id },
    include: [{ 
      model: Location,
      where: { state_id: state.id },
      include: [{ model: State, attributes: ['slug'] }]
    }],
    order: [[Location, 'name', 'ASC']]
  });

  const activeCities = serviceLocations.map(sl => sl.Location).filter(Boolean);

  return (
    <div className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      <HeadScript html={seoData?.page_header} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <Link 
          href="/locations" 
          className="inline-flex items-center text-xs font-extrabold text-gray-400 hover:text-red-650 transition-colors group cursor-pointer uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Locations Finder</span>
        </Link>

        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-red-650 font-extrabold text-[10px] uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            {service.name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Active Hubs in <span className="text-red-600">{state.name}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            We provide our fully licensed `{service.name}` service across multiple municipalities in {state.name}. Choose your local town below to book a crew:
          </p>
        </div>

        {activeCities.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-150">
            <p className="text-gray-400 font-bold text-sm">No active cities are registered in {state.name} for this service yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
            {activeCities.map(city => (
              <Link 
                key={city.id}
                href={`/${state.slug}/${service.slug}-in-${city.slug}`}
                className="group p-6 bg-white border border-gray-150 rounded-2xl hover:border-red-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-wider block mb-1">Local Active Crew</span>
                  <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-red-650 transition-colors">
                    {city.name} Center
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3 text-[11px] font-bold text-gray-400 group-hover:text-red-600 transition-colors">
                  <span>View Rates & Schedule</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </div>
  );
}

// 3. Standalone Location Detail Page (e.g. Calgary moving services list)
async function LocationDetailPage({ location, state, seoData }) {
  // Query all services active in this specific location
  const serviceLocations = await ServiceLocation.findAll({
    where: { location_id: location.id },
    include: [{ model: Service }]
  });

  const availableServices = serviceLocations.map(sl => sl.Service).filter(Boolean);

  return (
    <div className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      <HeadScript html={seoData?.page_header} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <Link 
          href="/locations" 
          className="inline-flex items-center text-xs font-extrabold text-gray-400 hover:text-red-650 transition-colors group cursor-pointer uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Locations Finder</span>
        </Link>

        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-red-650 font-extrabold text-[10px] uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            {state.name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Moving Services in <span className="text-red-600">{location.name}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Galaxy Movers is fully staffed and active in {location.name}, offering professional packing, assembly, residential, and office moving. Select your needed service below to get started:
          </p>
        </div>

        {availableServices.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-150">
            <p className="text-gray-400 font-bold text-sm">No specialized services are mapped for {location.name} currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {availableServices.map(svc => (
              <Link 
                key={svc.id}
                href={`/${state.slug}/${svc.slug}-in-${location.slug}`}
                className="group p-8 bg-white border border-gray-150 rounded-3xl hover:border-red-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-between"
              >
                <div className="space-y-2">
                  <div className="bg-red-50 text-red-650 p-2.5 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-all">
                    {getServiceIcon(svc.slug)}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-red-650 transition-colors pt-2">
                    {svc.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Active in {location.name}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-150 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all shrink-0">
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </div>
  );
}

// Helper to resolve service icons
function getServiceIcon(slug) {
  const css = "h-5 w-5";
  switch (slug) {
    case 'residential-moving':
      return <Home className={css} />;
    case 'commercial-office-moves':
      return <Briefcase className={css} />;
    case 'long-distance-relocations':
      return <Navigation className={css} />;
    case 'professional-packing-services':
      return <Package className={css} />;
    case 'furniture-disassembly-assembly':
      return <Hammer className={css} />;
    case 'secure-storage-solutions':
      return <Warehouse className={css} />;
    default:
      return <MapPin className={css} />;
  }
}
