import Seo from '../models/Seo.js';
 
/**
 * Parses a string of HTML and extracts script and noscript tags.
 * This is used to render scripts in a way that is compatible with Next.js hydration.
 */
export function parseScriptTags(html) {
  if (!html) return [];
  const tags = [];
  
  // Clean comments first
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Regex to match script, noscript, meta, link tags
  const tagRegex = /<(script|noscript|meta|link)([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>|>)/gm;
  
  let match;
  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    let attrString = match[2];
    let content = match[3] || '';
    
    // Clean trailing slash for self-closing tags if present
    if (attrString.endsWith('/')) {
      attrString = attrString.slice(0, -1);
    }
    
    // Parse attributes
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const name = attrMatch[1];
      const value = attrMatch[2] !== undefined ? attrMatch[2] : (attrMatch[3] !== undefined ? attrMatch[3] : (attrMatch[4] !== undefined ? attrMatch[4] : true));
      
      const reactName = name === 'class' ? 'className' : name;
      attrs[reactName] = value;
    }
    
    tags.push({ tagName, attrs, content });
  }
  return tags;
}
 
export async function getPageMetadata(path) {
  try {
    // If the path starts with /admin, skip SEO query
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return null;
    }
 
    const isGlobal = path === 'GLOBAL';
 
    const [pageData, globalData] = await Promise.all([
      isGlobal ? Promise.resolve(null) : Seo.findOne({ where: { page_path: path } }),
      Seo.findOne({ where: { page_path: 'GLOBAL' } }).then(async (row) => {
        // Fallback to '/' homepage row as global configuration if 'GLOBAL' row is not seeded yet
        if (!row) {
          return await Seo.findOne({ where: { page_path: '/' } });
        }
        return row;
      })
    ]);
 
    const page = pageData ? pageData.toJSON() : {};
    const global = globalData ? globalData.toJSON() : {};
 
    const siteName = global.title || 'Galaxy Movers Canada';
    const defaultDesc = global.description || "Canada's most trusted moving company. Local & long distance moving.";
 
    let title = '';
    if (isGlobal) {
      title = global.title || 'Galaxy Movers Canada';
    } else if (path === '/') {
      title = page.title || siteName;
    } else {
      const pageTitle = page.title || (path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      title = page.title ? `${page.title} | ${siteName}` : `${pageTitle} | ${siteName}`;
    }
 
    const description = page.description || defaultDesc;
    const keywords = [page.keywords, global.keywords].filter(Boolean).join(', ');
    const ogImage = page.og_image || global.og_image || '';
    const canonical = page.canonical_url || global.canonical_url || '';
 
    return {
      title,
      description,
      keywords,
      canonical_url: canonical,
      alternates: {
        canonical: canonical || undefined,
      },
      
      // Native script strings to avoid property access errors
      header_scripts: page.header_scripts || '',
      footer_scripts: page.footer_scripts || '',
 
      // Raw script strings (Kalyan format)
      global_header: global.header_scripts || '',
      global_footer: global.footer_scripts || '',
      page_header: page.header_scripts || '',
      page_footer: page.footer_scripts || '',
 
      // Separate tags
      global_header_tags: parseScriptTags(global.header_scripts || ''),
      global_footer_tags: parseScriptTags(global.footer_scripts || ''),
      page_header_tags: parseScriptTags(page.header_scripts || ''),
      page_footer_tags: parseScriptTags(page.footer_scripts || ''),
 
      openGraph: {
        title: page.og_title || title,
        description: page.og_description || description,
        images: ogImage ? [{ url: ogImage }] : [],
        siteName: siteName,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: page.og_title || title,
        description: page.og_description || description,
        images: ogImage ? [ogImage] : [],
      }
    };
  } catch (error) {
    console.error('Error fetching SEO metadata from MySQL:', error);
    return {
      title: 'Galaxy Movers Canada | Professional Moving Services',
      description: "Canada's most trusted moving company. Stress-free residential and commercial moves coast to coast.",
      keywords: 'moving company, professional movers, galaxy movers canada',
      canonical_url: '',
      alternates: { canonical: '' },
      header_scripts: '',
      footer_scripts: '',
      global_header: '',
      global_footer: '',
      page_header: '',
      page_footer: '',
      global_header_tags: [],
      global_footer_tags: [],
      page_header_tags: [],
      page_footer_tags: []
    };
  }
}
