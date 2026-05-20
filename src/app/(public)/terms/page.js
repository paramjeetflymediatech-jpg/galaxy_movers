import Link from 'next/link';
import { FileText, Hammer, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/terms');
  return {
    title: seoData?.title || 'Terms of Service | Galaxy Movers Canada',
    description: seoData?.description || 'Read the terms of service, cancellation policies, and cargo transit liabilities of Galaxy Movers Canada.',
    keywords: seoData?.keywords || 'terms of service, movers terms, cargo policy canada',
    alternates: {
      canonical: seoData?.canonical_url || undefined,
    }
  };
}

export default async function TermsPage() {
  const seoData = await getPageMetadata('/terms');

  return (
    <article className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      <HeadScript html={seoData?.page_header} />

      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-0 w-[350px] h-[350px] bg-gray-50 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-extrabold text-gray-400 hover:text-red-650 transition-colors uppercase tracking-widest cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Meta Header */}
        <div className="pb-8 border-b border-gray-100 space-y-4">
          <span className="text-red-650 font-extrabold text-[10px] uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Service Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 font-bold">
            Last Updated: May 20, 2026
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Scale className="h-5 w-5 text-red-600" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Pricing Integrity</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              All quotes represent binding agreements based on inventories provided. No hidden charges.
            </p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <ShieldCheck className="h-5 w-5 text-red-650" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Cargo Liability</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Standard transit protection options and full valuations details are clearly laid out.
            </p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Hammer className="h-5 w-5 text-gray-600" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Crew Safety</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Operating rules ensure the safety of our moving crew and your structural assets.
            </p>
          </div>
        </div>

        {/* Detailed Prose Content */}
        <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-650 prose-li:text-gray-650 prose-strong:text-gray-900 prose-headings:tracking-tight font-medium text-sm sm:text-base space-y-6">
          
          <h2 className="text-xl font-extrabold text-gray-900 pt-4">1. Scope of Services</h2>
          <p>
            Galaxy Movers Canada coordinates logistics, loading, transport, and assembly services across various Canadian states. By booking a date, the customer agrees to the parameters detailed herein:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access Restrictions:</strong> The customer must ensure clear path access, functional elevators if applicable, and parking clearances at both locations.</li>
            <li><strong>Hazardous Materials:</strong> Our crews are prohibited by Canadian transport safety laws from carrying flammable liquids, propane, loaded ammunition, or open paints.</li>
            <li><strong>Valuables & Documents:</strong> High-value jewelry, vital identity documents, and cash deposits must remain under the customer's personal control.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">2. Scheduling & Cancellation Policy</h2>
          <p>
            Securing a calendar slot requires verification. To cancel or change dates:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Changes (48h+ Notice):</strong> No penalties apply when requests are submitted more than 48 hours prior to dispatch.</li>
            <li><strong>Short-Notice Adjustments:</strong> Bookings canceled with less than 48 hours notice may result in an adjustment fee to cover dispatch mobilization costs.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">3. Damage Claims & Liability</h2>
          <p>
            Galaxy Movers utilizes premium thick wraps and heavy-duty padding, but in the rare event of transit friction:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Valuation:</strong> Included automatically, covering cargo items up to the maximum standard release value.</li>
            <li><strong>Pre-existing Conditions:</strong> We cannot accept liability for electronics internally failing without structural casing damage, or pre-assembled pressed-wood furniture.</li>
            <li><strong>Claims Filing:</strong> Written damage notifications with item descriptions must be emailed within 14 days of move completion.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">4. Governing Law</h2>
          <p>
            This service agreement and any operations scheduled are governed by the provincial regulations of the location where transit begins, conforming fully to standard Canadian commerce laws.
          </p>

        </div>

      </div>

      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </article>
  );
}
