import { notFound } from 'next/navigation';
import Link from 'next/link';
import Blog from '@/models/Blog';
import { getPageMetadata } from '@/lib/seo';
import { Calendar, User, ArrowLeft, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import FAQAccordion from './FAQAccordion'; // client helper for FAQs
import FAQschema from '@/components/Seo/FAQschema';
import HeadScript from '@/components/Seo/HeadScript';
 
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/blog/${slug}`;
  
  const [seoData, blogRecord] = await Promise.all([
    getPageMetadata(path),
    Blog.findOne({ where: { slug, status: 'published' } })
  ]);
 
  if (!blogRecord) return {};
 
  const blog = blogRecord.toJSON();
 
  // If a custom administrative SEO path is found, use it; otherwise fallback to dynamic blog values
  const title = seoData?.title && seoData.title !== 'Blog/[Slug] | Galaxy Movers Canada'
    ? seoData.title
    : `${blog.title} | Galaxy Movers Canada`;
 
  const description = seoData?.description && seoData.description.length > 30
    ? seoData.description
    : blog.excerpt;
 
  return {
    title,
    description,
    keywords: seoData?.keywords || 'moving tips, packing guides, relocation advice',
    alternates: {
      canonical: seoData?.canonical_url || undefined,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      images: blog.image ? [{ url: blog.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.image ? [blog.image] : [],
    }
  };
}
 
export default async function BlogDetail({ params }) {
  const { slug } = await params;
 
  // Query blog post from MySQL
  const blogRecord = await Blog.findOne({
    where: { slug, status: 'published' }
  });
 
  if (!blogRecord) {
    notFound();
  }
 
  const blog = blogRecord.toJSON();
 
  // Fetch optional SEO scripts for this specific post path
  const path = `/blog/${slug}`;
  const seoData = await getPageMetadata(path);
 
  // Parse FAQs if present
  let faqs = [];
  if (blog.faqs) {
    try {
      faqs = JSON.parse(blog.faqs);
    } catch (e) {
      console.error('Error parsing blog FAQs:', e);
    }
  }
 
  // Format dates helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
 
  return (
    <article className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      {/* Dynamic Server-Side Header Script Injections */}
      <HeadScript html={seoData?.page_header} />
      
      {/* Render Schema-based JSON-LD FAQ Data */}
      <FAQschema faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} />
 
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-50/30 rounded-full blur-[120px] pointer-events-none"></div>
 
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-red-600 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>
 
        {/* Article Meta Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-sm font-bold text-gray-400 uppercase tracking-wider pt-2">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-red-500" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2 text-red-500" />
              {blog.author || 'Admin'}
            </span>
          </div>
        </div>
 
        {/* Featured Cover Image */}
        {blog.image && (
          <div className="aspect-[21/9] w-full rounded-3xl bg-gray-100 overflow-hidden shadow-lg border border-gray-100 relative">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
 
        {/* Article Rich Text Content */}
        <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-headings:tracking-tight prose-a:text-red-600 hover:prose-a:text-red-700 font-medium">
          {/* Output long HTML text generated by Rich Text Editor */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
 
        {/* Optional Article-Specific FAQs Accordion */}
        {faqs.length > 0 && (
          <div className="pt-8 border-t border-gray-100 space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h3>
            <FAQAccordion faqs={faqs} />
          </div>
        )}
 
        {/* Relocation CTA Promo Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 mt-16">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-gray-900">
              Planning a Move?
            </h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed">
              Secure your premium moving date online today.
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
