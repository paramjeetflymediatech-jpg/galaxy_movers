import { headers } from 'next/headers';
import Blog from '@/models/Blog';
import Location from '@/models/Location';
import State from '@/models/State';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Force Next.js to run this route dynamically at request time
  await headers();

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://galaxymovers.ca';

  // 1. Static Pages
  const staticPaths = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/locations', changefreq: 'weekly', priority: '0.8' },
    { loc: '/book-appointment', changefreq: 'monthly', priority: '0.7' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
    { loc: '/blog', changefreq: 'daily', priority: '0.7' },
  ];

  // 2. Fetch Blogs from the Database
  let blogs = [];
  try {
    blogs = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'updatedAt'],
    });
  } catch (err) {
    console.error('Error fetching blogs for sitemap:', err);
  }

  // 3. Fetch Cities/Locations from the Database
  let locations = [];
  try {
    locations = await Location.findAll({
      include: [{ model: State, attributes: ['slug'] }],
      attributes: ['slug', 'updatedAt'],
    });
  } catch (err) {
    console.error('Error fetching locations for sitemap:', err);
  }
console.log(locations.length,'megth')
  // Format date to ISO string
  const formatDate = (date) => {
    return (date ? new Date(date) : new Date()).toISOString();
  };

  // Build the XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static pages
  staticPaths.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${formatDate()}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add blogs
  blogs.forEach((blog) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${formatDate(blog.updatedAt)}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add location pages (excluding service pages)
  locations
    .filter((loc) => loc.State !== null)
    .forEach((loc) => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/${loc.State.slug}/${loc.slug}</loc>\n`;
      xml += `    <lastmod>${formatDate(loc.updatedAt)}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
