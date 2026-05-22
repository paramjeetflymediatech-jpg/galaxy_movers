import { headers } from 'next/headers';
import Blog from '@/models/Blog';
import Location from '@/models/Location';
import State from '@/models/State';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Force Next.js to render this dynamically at request time
  await headers();

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://galaxymovers.ca';

  // 1. Fetch Blogs
  let blogs = [];
  try {
    blogs = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['title', 'slug'],
      order: [['published_at', 'DESC'], ['created_at', 'DESC']]
    });
  } catch (err) {
    console.error('Error fetching blogs for llms.txt:', err);
  }

  // 2. Fetch Locations
  let locations = [];
  try {
    locations = await Location.findAll({
      include: [{ model: State, attributes: ['name', 'slug'] }],
      attributes: ['name', 'slug'],
      order: [['name', 'ASC']]
    });
  } catch (err) {
    console.error('Error fetching locations for llms.txt:', err);
  }

  // Build markdown content for llms.txt
  let content = `# Galaxy Movers Canada\n\n`;
  content += `> Professional relocation and moving specialists serving clients across Canada.\n\n`;

  content += `## Information Pages\n`;
  content += `- [Home Page](${BASE_URL}/) - Premium local and long distance moving services.\n`;
  content += `- [About Us](${BASE_URL}/about) - Discover the story, mission, and professional credentials behind Canada's top relocation specialists.\n`;
  content += `- [Locations](${BASE_URL}/locations) - Comprehensive list of cities and provinces served across Canada.\n`;
  content += `- [Book Appointment](${BASE_URL}/book-appointment) - Schedule your moving consultation and request quotes.\n`;
  content += `- [Privacy Policy](${BASE_URL}/privacy) - Privacy policies and guidelines.\n`;
  content += `- [Terms of Service](${BASE_URL}/terms) - Terms and conditions for our relocation services.\n`;
  content += `- [Blog](${BASE_URL}/blog) - Dynamic posts, guides, and resources for stress-free moving.\n\n`;

  if (locations.length > 0) {
    content += `## Service Locations\n`;
    locations
      .filter((loc) => loc.State !== null)
      .forEach((loc) => {
        content += `- [Movers in ${loc.name}, ${loc.State.name}](${BASE_URL}/${loc.State.slug}/${loc.slug})\n`;
      });
    content += `\n`;
  }

  if (blogs.length > 0) {
    content += `## Blog Articles\n`;
    blogs.forEach((blog) => {
      content += `- [${blog.title}](${BASE_URL}/blog/${blog.slug})\n`;
    });
    content += `\n`;
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
