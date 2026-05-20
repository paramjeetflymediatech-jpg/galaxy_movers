import React from 'react';

/**
 * Parses a string of HTML and extracts script, noscript, meta, and link tags.
 * Placed here to make the component client-safe and avoid importing server-only models.
 */
function parseScriptTags(html) {
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
    const content = match[3] || '';
    
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

export default function HeadScript({ html }) {
  if (!html) return null;

  const tags = parseScriptTags(html);

  return (
    <>
      {tags.map((tag, idx) => {
        const { tagName, attrs, content } = tag;
        const key = `${tagName}-${idx}`;

        // Map class to className for React compatibility
        const reactAttrs = { ...attrs };
        if (reactAttrs.class) {
          reactAttrs.className = reactAttrs.class;
          delete reactAttrs.class;
        }

        if (tagName === 'script') {
          return (
            <script
              key={key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'noscript') {
          return (
            <noscript
              key={key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'meta') {
          return <meta key={key} {...reactAttrs} />;
        }
        if (tagName === 'link') {
          return <link key={key} {...reactAttrs} />;
        }
        return null;
      })}
    </>
  );
}
