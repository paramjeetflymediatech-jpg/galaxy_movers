import Link from 'next/link';
import ServiceLocation from '@/models/ServiceLocation';
import Service from '@/models/Service';
import Location from '@/models/Location';
import State from '@/models/State';
import Blog from '@/models/Blog';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';
import { MapPin, FileText, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/sitemap');
  if (seoData) {
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
  return {
    title: 'Sitemap | Galaxy Movers Canada',
    description: 'Explore the complete map of services, blog articles, and location-specific moving solutions offered by Galaxy Movers Canada.'
  };
}

export default async function SitemapHTMLPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page) || 1;
  const limit = 48; // Number of service locations per page
  const offset = (page - 1) * limit;

  // 1. Fetch SEO Data for sitemap page path
  const seoData = await getPageMetadata('/sitemap');

  // 2. Fetch General Pages
  const generalPages = [
    { name: 'Home Page', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'All Locations / Provinces', href: '/locations' },
    { name: 'Book Appointment', href: '/book-appointment' },
    { name: 'Blog / Moving Tips', href: '/blog' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  // 3. Fetch Blogs
  let blogs = [];
  try {
    const blogRecords = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['title', 'slug'],
      order: [['createdAt', 'DESC']]
    });
    blogs = blogRecords.map(r => r.toJSON());
  } catch (err) {
    console.error('Error fetching blogs for HTML sitemap:', err);
  }

  // 4. Fetch Paginated Service Locations
  let serviceLocations = [];
  let totalServiceLocations = 0;
  try {
    const { count, rows } = await ServiceLocation.findAndCountAll({
      include: [
        {
          model: Service,
          attributes: ['name', 'slug']
        },
        {
          model: Location,
          attributes: ['name', 'slug'],
          include: [{ model: State, attributes: ['name', 'slug'] }]
        }
      ],
      limit,
      offset,
      order: [
        [Location, 'name', 'ASC'],
        [Service, 'name', 'ASC']
      ]
    });
    totalServiceLocations = count;
    serviceLocations = rows.map(r => r.toJSON());
  } catch (err) {
    console.error('Error fetching service locations for HTML sitemap:', err);
  }

  const totalPages = Math.ceil(totalServiceLocations / limit);
  const startItem = offset + 1;
  const endItem = Math.min(offset + limit, totalServiceLocations);

  // Pagination page numbers generation helper
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white py-16 lg:py-24 relative overflow-hidden min-h-screen">
      {/* Page-specific Header Script Injections */}
      <HeadScript html={seoData?.page_header} />

      {/* Background Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-50/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Navigation Index
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">
            Website Sitemap
          </h1>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base sm:text-lg text-gray-500 font-medium">
            A comprehensive visual index of all information pages, articles, and dynamic local service locations across Canada.
          </p>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: General Pages & Blogs */}
          <div className="lg:col-span-1 space-y-12">
            
            {/* General Pages Section */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Info className="h-5 w-5 text-red-600" />
                <span>General Pages</span>
              </h2>
              <div className="w-8 h-0.5 bg-red-600 rounded-full"></div>
              <ul className="space-y-4">
                {generalPages.map((page, idx) => (
                  <li key={idx}>
                    <Link
                      href={page.href}
                      className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                      <span>{page.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blogs Section */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>Articles & Guides</span>
              </h2>
              <div className="w-8 h-0.5 bg-red-600 rounded-full"></div>
              {blogs.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium">No published articles.</p>
              ) : (
                <ul className="space-y-4">
                  {blogs.map((blog, idx) => (
                    <li key={idx}>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors flex items-start gap-2 line-clamp-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                        <span>{blog.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Service Locations with Pagination */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-red-600" />
                  <span>Services by Location</span>
                </h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Canada Relocation Map
                </p>
              </div>
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
                {totalServiceLocations > 0 ? (
                  <span>Showing {startItem}–{endItem} of {totalServiceLocations} Services</span>
                ) : (
                  <span>No Service Locations Configured</span>
                )}
              </div>
            </div>

            {/* Service Location Grid */}
            {serviceLocations.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-gray-400 font-bold">No location services found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceLocations.map((sl) => {
                  const stateSlug = sl.Location?.State?.slug;
                  const locSlug = sl.Location?.slug;
                  const svcSlug = sl.Service?.slug;
                  const isLinkable = stateSlug && locSlug && svcSlug;
                  
                  const linkHref = isLinkable 
                    ? `/${stateSlug}/${svcSlug}-in-${locSlug}` 
                    : '#';

                  return (
                    <div 
                      key={sl.id} 
                      className="border border-gray-100 hover:border-red-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5 transition-all duration-300 bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-extrabold text-red-600 bg-red-50 px-2 py-1 rounded-md inline-block">
                          {sl.Location?.State?.name || 'Province'}
                        </span>
                        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                          {sl.Service?.name || 'Service'} in {sl.Location?.name || 'City'}
                        </h3>
                      </div>
                      <div className="pt-4 mt-3 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">{sl.Location?.name} relocation</span>
                        {isLinkable && (
                          <Link 
                            href={linkHref}
                            className="text-xs text-red-600 font-extrabold flex items-center gap-1 group/link"
                          >
                            <span>Go to Page</span>
                            <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Page {page} of {totalPages}
                </div>
                <nav className="inline-flex rounded-xl shadow-sm bg-gray-50 p-1 border border-gray-100 items-center">
                  {/* Prev Button */}
                  {page > 1 ? (
                    <Link
                      href={`/sitemap?page=${page - 1}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Link>
                  ) : (
                    <span className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
                      <ChevronLeft className="h-5 w-5" />
                    </span>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center mx-2 gap-1">
                    {pageNumbers[0] > 1 && (
                      <>
                        <Link
                          href="/sitemap?page=1"
                          className="px-3 py-1.5 text-xs font-bold rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition-colors"
                        >
                          1
                        </Link>
                        {pageNumbers[0] > 2 && <span className="text-gray-300 text-xs font-semibold px-1">...</span>}
                      </>
                    )}

                    {pageNumbers.map((num) => (
                      <Link
                        key={num}
                        href={`/sitemap?page=${num}`}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                          page === num
                            ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                            : 'text-gray-500 hover:text-red-600 hover:bg-white'
                        }`}
                      >
                        {num}
                      </Link>
                    ))}

                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <span className="text-gray-300 text-xs font-semibold px-1">...</span>
                        )}
                        <Link
                          href={`/sitemap?page=${totalPages}`}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition-colors"
                        >
                          {totalPages}
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  {page < totalPages ? (
                    <Link
                      href={`/sitemap?page=${page + 1}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                      title="Next Page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <span className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  )}
                </nav>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Page-specific Footer Script Injections */}
      {seoData?.footer_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
      )}
    </div>
  );
}
