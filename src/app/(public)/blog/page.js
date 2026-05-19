import Link from 'next/link';
import Image from 'next/image';
import Blog from '@/models/Blog';
import { getPageMetadata } from '@/lib/seo';
import { Calendar, User, ArrowRight } from 'lucide-react';
import HeadScript from '@/components/Seo/HeadScript';
 
export async function generateMetadata() {
  const seoData = await getPageMetadata('/blog');
  if (!seoData) return { title: 'Galaxy Movers Blog' };
 
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
 
export default async function BlogIndex() {
  const seoData = await getPageMetadata('/blog');
 
  // Fetch published blogs from MySQL
  let blogs = [];
  try {
    const records = await Blog.findAll({
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']]
    });
    blogs = records.map(r => r.toJSON());
  } catch (err) {
    console.error('Error fetching blogs in Server Component:', err);
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
    <div className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      {/* Page-specific Header Script Injections */}
      <HeadScript html={seoData?.page_header} />
 
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-50/40 rounded-full blur-[100px] pointer-events-none"></div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Moving Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">
            Relocation Guides & Checklists
          </h1>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Expert strategies, packing advice, and checklists curated by Galaxy Movers to make your next transition smooth.
          </p>
        </div>
 
        {/* Blogs grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-2xl mx-auto">
            <p className="text-gray-500 font-bold text-lg">No published blog posts yet.</p>
            <p className="text-gray-400 text-sm mt-1">Please check back later or log in to the admin panel to add posts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Featured Image */}
                  <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden group">
                    <img 
                      src={blog.image || 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800'} 
                      alt={blog.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
 
                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Meta row */}
                    <div className="flex items-center space-x-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        {blog.author || 'Admin'}
                      </span>
                    </div>
 
                    {/* Title */}
                    <h2 className="font-extrabold text-gray-900 text-lg leading-snug hover:text-red-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>
 
                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
 
                {/* Footer read link */}
                <div className="p-6 pt-0 border-t border-gray-50/50 mt-4">
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center font-bold text-xs text-red-600 hover:text-red-700 uppercase tracking-wider group/link"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-4 w-4 ml-1.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
 
      </div>
      
      {/* Page-specific Footer Script Injections */}
      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </div>
  );
}
