import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', '') || 'http');

  const customServerUrl = url.searchParams.get('server_url');

  let origin;
  if (customServerUrl) {
    origin = customServerUrl.replace(/\/+$/, '');
  } else if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    origin = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  } else if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    origin = `${protocol}://${host}`;
  } else {
    origin = 'https://galaxymoverscanada.com';
  }

  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Galaxy Movers AI Gateway API',
      description:
        'Autonomous Management API for Galaxy Movers. Allows ChatGPT Custom GPT to create, read, update, and manage SEO metadata, blog articles, services, locations, and localized city service landing pages.',
      version: '1.0.0',
      contact: {
        name: 'Galaxy Movers Web Engineering',
        email: 'noreply@galaxymoverscanada.com',
      },
    },
    servers: [
      {
        url: `${origin}/api/ai-gateway`,
        description: 'Current Galaxy Movers Gateway Server',
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      '/v1/seo': {
        get: {
          summary: 'Get SEO Metadata',
          description: 'Fetch SEO metadata configuration for a specific page path (e.g. "/" or "/alberta/calgary") or list all records.',
          operationId: 'getSeoMetadata',
          parameters: [
            {
              name: 'path',
              in: 'query',
              required: false,
              description: 'The page route path (e.g. "/", "/services", "/alberta/calgary", or "/alberta/residential-moving-in-calgary")',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'SEO record(s) retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SeoResponse' },
                },
              },
            },
            '404': { description: 'SEO record not found' },
          },
        },
        post: {
          summary: 'Create or Update SEO Metadata',
          description: 'Creates or updates the SEO meta title, description, keywords, OpenGraph tags, canonical URL, and schema/scripts for any path.',
          operationId: 'createOrUpdateSeoMetadata',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SeoUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'SEO metadata saved successfully' },
            '400': { description: 'Validation error' },
          },
        },
        delete: {
          summary: 'Delete SEO Metadata',
          description: 'Delete SEO record for a path or by ID.',
          operationId: 'deleteSeoMetadata',
          parameters: [
            { name: 'path', in: 'query', schema: { type: 'string' }, description: 'Page path to remove' },
            { name: 'id', in: 'query', schema: { type: 'integer' }, description: 'SEO ID to remove' },
          ],
          responses: {
            '200': { description: 'SEO record deleted successfully' },
            '404': { description: 'Not found' },
          },
        },
      },
      '/v1/blogs': {
        get: {
          summary: 'Get Blogs',
          description: 'Fetch published or draft blog posts, or retrieve a single post by slug or ID.',
          operationId: 'getBlogs',
          parameters: [
            { name: 'slug', in: 'query', schema: { type: 'string' }, description: 'Blog slug' },
            { name: 'id', in: 'query', schema: { type: 'integer' }, description: 'Blog ID' },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['published', 'draft'] } },
          ],
          responses: {
            '200': {
              description: 'Blog posts retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BlogResponse' },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create or Update Blog Article',
          description: 'Create a new blog article or update an existing one if the slug already exists.',
          operationId: 'createOrUpdateBlog',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogCreateUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Blog created or updated successfully' },
          },
        },
        put: {
          summary: 'Update Blog Article',
          description: 'Update specific fields of an existing blog article by ID or slug.',
          operationId: 'updateBlog',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogPutRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Blog updated' },
          },
        },
        delete: {
          summary: 'Delete Blog Article',
          description: 'Remove a blog post by slug or ID.',
          operationId: 'deleteBlog',
          parameters: [
            { name: 'slug', in: 'query', schema: { type: 'string' } },
            { name: 'id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Blog deleted' },
          },
        },
      },
      '/v1/services': {
        get: {
          summary: 'List Services',
          description: 'Retrieve all core moving services (e.g. Residential Moving, Commercial Moving, Long Distance Moving) or a single service by slug.',
          operationId: 'getServices',
          parameters: [
            { name: 'slug', in: 'query', schema: { type: 'string' }, description: 'Service slug (e.g. residential-moving)' },
            { name: 'id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'List of services' },
          },
        },
        post: {
          summary: 'Create or Update Service',
          description: 'Create a new core service or update content/faqs/descriptions of an existing service.',
          operationId: 'createOrUpdateService',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ServiceCreateUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Service saved' },
          },
        },
        delete: {
          summary: 'Delete Service',
          description: 'Delete service by slug or ID.',
          operationId: 'deleteService',
          parameters: [
            { name: 'slug', in: 'query', schema: { type: 'string' } },
            { name: 'id', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Service deleted' },
          },
        },
      },
      '/v1/locations': {
        get: {
          summary: 'List Locations & Cities',
          description: 'Retrieve all supported service cities, provinces/states, and districts.',
          operationId: 'getLocations',
          parameters: [
            { name: 'slug', in: 'query', schema: { type: 'string' }, description: 'Location city slug (e.g. calgary, edmonton)' },
            { name: 'state', in: 'query', schema: { type: 'string' }, description: 'State/Province slug (e.g. alberta)' },
          ],
          responses: {
            '200': { description: 'Locations list' },
          },
        },
        post: {
          summary: 'Create or Update Location',
          description: 'Add or update a city/location record with province/state association.',
          operationId: 'createOrUpdateLocation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Calgary' },
                    slug: { type: 'string', example: 'calgary' },
                    state_slug: { type: 'string', example: 'alberta' },
                    district_id: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Location saved' },
          },
        },
      },
      '/v1/service-locations': {
        get: {
          summary: 'Get Service Location Landing Pages',
          description: 'Retrieve localized city service landing pages (e.g. Residential Moving in Calgary) with custom description, content, and FAQs.',
          operationId: 'getServiceLocations',
          parameters: [
            { name: 'service', in: 'query', schema: { type: 'string' }, description: 'Service slug or name' },
            { name: 'location', in: 'query', schema: { type: 'string' }, description: 'City/Location slug or name' },
            { name: 'slug', in: 'query', schema: { type: 'string' }, description: 'Composite slug e.g. residential-moving-in-calgary' },
          ],
          responses: {
            '200': { description: 'Service locations retrieved' },
          },
        },
        post: {
          summary: 'Create or Update Service Location Landing Page',
          description: 'Update unique localized HTML content, custom city description, FAQs, and optional SEO metadata for a specific city-service page (e.g. Residential Moving in Calgary).',
          operationId: 'createOrUpdateServiceLocation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ServiceLocationCreateUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Service location page saved and SEO synchronized' },
          },
        },
        delete: {
          summary: 'Delete Service Location',
          description: 'Remove a service-location junction relation by ID.',
          operationId: 'deleteServiceLocation',
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Service location deleted' },
          },
        },
      },
    },
    components: {
      schemas: {
        SeoResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
        SeoUpdateRequest: {
          type: 'object',
          required: ['page_path', 'title'],
          properties: {
            page_path: {
              type: 'string',
              description: 'The page path, e.g. "/", "/services", "/alberta/calgary", or "/alberta/residential-moving-in-calgary"',
              example: '/alberta/calgary',
            },
            title: {
              type: 'string',
              description: 'High ranking 50-60 character SEO meta title.',
              example: 'Best Movers in Calgary | Professional & Affordable | Galaxy Movers',
            },
            description: {
              type: 'string',
              description: 'Compelling 140-160 character meta description with CTA.',
              example: 'Looking for reliable movers in Calgary? Galaxy Movers provides stress-free residential & commercial moving. Get a free quote today!',
            },
            keywords: {
              type: 'string',
              description: 'Target keywords comma separated.',
              example: 'movers in calgary, moving company calgary, local movers calgary',
            },
            canonical_url: {
              type: 'string',
              description: 'Full canonical URL.',
              example: 'https://galaxymoverscanada.com/alberta/calgary',
            },
            og_title: {
              type: 'string',
              description: 'OpenGraph title for social media previews.',
            },
            og_description: {
              type: 'string',
              description: 'OpenGraph description.',
            },
            og_image: {
              type: 'string',
              description: 'Featured image URL for OpenGraph.',
            },
            header_scripts: {
              type: 'string',
              description: 'JSON-LD Schema Markup or header tracking scripts.',
            },
            footer_scripts: {
              type: 'string',
              description: 'Footer tracking scripts.',
            },
          },
        },
        BlogResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
        BlogCreateUpdateRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              description: 'Blog post title',
              example: 'The Ultimate Guide to Moving in Calgary: Tips for a Stress-Free Relocation',
            },
            slug: {
              type: 'string',
              description: 'URL slug (kebab-case). Generated automatically if omitted.',
              example: 'guide-moving-calgary-stress-free',
            },
            excerpt: {
              type: 'string',
              description: 'Brief overview or summary (1-2 sentences).',
            },
            content: {
              type: 'string',
              description: 'Full rich HTML content for the blog post with <h2>, <h3>, <p>, <ul>, <li>.',
            },
            image: {
              type: 'string',
              description: 'Cover image URL.',
            },
            author: {
              type: 'string',
              default: 'Galaxy Movers Team',
            },
            status: {
              type: 'string',
              enum: ['draft', 'published'],
              default: 'published',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Publish date timestamp.',
            },
            faqs: {
              type: 'string',
              description: 'JSON string or array of FAQs [{ question, answer }].',
            },
          },
        },
        BlogPutRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            slug: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            image: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published'] },
            faqs: { type: 'string' },
          },
        },
        ServiceCreateUpdateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Residential Moving' },
            slug: { type: 'string', example: 'residential-moving' },
            description: { type: 'string', description: 'Short introductory description' },
            content: { type: 'string', description: 'Full formatted HTML overview of the service' },
            faqs: { type: 'string', description: 'JSON array or string of FAQs' },
          },
        },
        ServiceLocationCreateUpdateRequest: {
          type: 'object',
          properties: {
            service_slug: {
              type: 'string',
              description: 'Base service slug (e.g. residential-moving, commercial-moving, long-distance-moving)',
              example: 'residential-moving',
            },
            location_slug: {
              type: 'string',
              description: 'City/location slug (e.g. calgary, edmonton, red-deer)',
              example: 'calgary',
            },
            slug: {
              type: 'string',
              description: 'Alternative composite slug (e.g. residential-moving-in-calgary)',
            },
            description: {
              type: 'string',
              description: 'Unique localized HTML or text description specifically tailored for this city.',
              example: 'Premier residential moving services in Calgary with transparent pricing and experienced local movers.',
            },
            content: {
              type: 'string',
              description: 'Full rich HTML body content formatted with <h2>, <h3>, <p>, <ul>, <li>.',
            },
            faqs: {
              type: 'string',
              description: 'City-specific moving FAQs (JSON string or array of { question, answer }).',
            },
            seo_title: {
              type: 'string',
              description: 'Custom SEO title to sync to page_path automatically.',
            },
            meta_description: {
              type: 'string',
              description: 'Custom meta description to sync to page_path automatically.',
            },
            keywords: {
              type: 'string',
              description: 'Target keywords to sync to page_path automatically.',
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'API-Key',
          description: 'Enter your AI_GATEWAY_SECRET_KEY as Bearer Token',
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
