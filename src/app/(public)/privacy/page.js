import Link from 'next/link';
import { ShieldCheck, Eye, Lock, FileText, ArrowLeft } from 'lucide-react';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import { ABOUT } from '@/lib/constant';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/privacy');
  return {
    title: seoData?.title || 'Privacy Policy | Galaxy Movers Canada',
    description: seoData?.description || 'Learn how Galaxy Movers Canada collects, uses, protects, and handles your personal information.',
    keywords: seoData?.keywords || 'privacy policy, galaxy movers data protection',
    alternates: {
      canonical: seoData?.canonical_url || undefined,
    }
  };
}

export default async function PrivacyPage() {
  const seoData = await getPageMetadata('/privacy');

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
            Legal Information
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 font-bold">
            Last Updated: May 20, 2026
          </p>
        </div>

        {/* Introduction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Eye className="h-5 w-5 text-red-600" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Transparency</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              We clearly detail the data we collect and how we utilize it to improve our moving services.
            </p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Lock className="h-5 w-5 text-red-650" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Security</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Modern encryption standards protect your inventory sheets, names, addresses, and transaction info.
            </p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Your Rights</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              You maintain full access rights to edit or request deletion of stored information at any time.
            </p>
          </div>
        </div>

        {/* Detailed Prose Content */}
        <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-650 prose-li:text-gray-650 prose-strong:text-gray-900 prose-headings:tracking-tight font-medium text-sm sm:text-base space-y-6">
          
          <h2 className="text-xl font-extrabold text-gray-900 pt-4">1. Information We Collect</h2>
          <p>
            When you request a moving estimate, schedule a crew, or interact with the Galaxy Movers portal, we collect relevant information to process your request:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Identifiers:</strong> Name, phone numbers, email address, and billing contacts.</li>
            <li><strong>Relocation Coordinates:</strong> Origin address, destination address, and layout parameters of the properties.</li>
            <li><strong>Inventory Data:</strong> Lists of items, photos, estimated volume, and special assembly instructions.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">2. How We Use Your Information</h2>
          <p>
            Galaxy Movers Canada processes details under strict guidelines. The collected information is used solely to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate flat-rate relocation estimates and secure calendar scheduling.</li>
            <li>Coordinate localized logistics, modern trucks, packing supplies, and crew assignments.</li>
            <li>Send dispatch updates, arrival notifications, and electronic invoices.</li>
            <li>Optimize site speeds, localized search availability, and Google Places review integrations.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">3. Information Protection & Sharing</h2>
          <p>
            Your trust is vital. We do not rent, sell, or trade client details to any third-party brokers. Data sharing is limited to essential operations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Local Crews & Dispatch:</strong> Mapped coordinators only receive logistics and address layouts needed to fulfill the move.</li>
            <li><strong>Payment Gateways:</strong> Secured processing systems encrypt payment details during validation.</li>
            <li><strong>Compliance:</strong> Releasing data only if legally required to protect crew safety or conform to Canadian regulations.</li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 pt-4">4. Contact Our Data Compliance Team</h2>
          <p>
            If you have questions regarding personal information access, database records deletion, or localized data compliance, please reach out directly:
          </p>
          <p className="bg-gray-50 border border-gray-150 p-6 rounded-2xl font-bold text-gray-700 leading-relaxed text-xs">
            Galaxy Movers Data Officer<br/>
            Email: <a href={`mailto:${ABOUT[0].email[0]}`} className="text-red-650 hover:underline">{ABOUT[0].email[0]}</a><br/>
            Phone: {ABOUT[0].phone[0]}
          </p>

        </div>

      </div>

      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </article>
  );
}
