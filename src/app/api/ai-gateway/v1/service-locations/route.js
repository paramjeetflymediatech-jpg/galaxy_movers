import ServiceLocation from '@/models/ServiceLocation';
import Service from '@/models/Service';
import Location from '@/models/Location';
import State from '@/models/State';
import Seo from '@/models/Seo';
import { authenticateAiGateway, handleOptions, jsonResponse } from '@/lib/ai-gateway-auth';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function parseServiceAndLocation(input) {
  if (!input || typeof input !== 'string') return { serviceSlug: null, locationSlug: null };
  let str = input.trim();
  str = str.replace(/^https?:\/\/[^\/]+/i, '');
  str = str.split('?')[0].split('#')[0];
  str = str.replace(/^\/+|\/+$/g, '');
  const segments = str.split('/');
  const target = segments[segments.length - 1] || '';
  if (target.includes('-in-')) {
    const parts = target.split('-in-');
    return {
      serviceSlug: parts[0],
      locationSlug: parts.slice(1).join('-in-'),
    };
  }
  return { serviceSlug: null, locationSlug: null };
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const serviceQuery = url.searchParams.get('service') || url.searchParams.get('service_slug');
    const locationQuery = url.searchParams.get('location') || url.searchParams.get('city') || url.searchParams.get('location_slug');
    const slugQuery = url.searchParams.get('slug') || url.searchParams.get('path') || url.searchParams.get('url');

    let targetServiceSlug = serviceQuery ? slugify(serviceQuery) : null;
    let targetLocationSlug = locationQuery ? slugify(locationQuery) : null;

    if (slugQuery) {
      const parsed = parseServiceAndLocation(slugQuery);
      if (parsed.serviceSlug) targetServiceSlug = targetServiceSlug || parsed.serviceSlug;
      if (parsed.locationSlug) targetLocationSlug = targetLocationSlug || parsed.locationSlug;
    }

    const where = {};
    const serviceInclude = { model: Service, attributes: ['id', 'name', 'slug'] };
    const locationInclude = {
      model: Location,
      attributes: ['id', 'name', 'slug'],
      include: [{ model: State, attributes: ['id', 'name', 'slug'] }],
    };

    if (targetServiceSlug) {
      serviceInclude.where = { slug: targetServiceSlug };
    }
    if (targetLocationSlug) {
      locationInclude.where = { slug: targetLocationSlug };
    }

    const records = await ServiceLocation.findAll({
      where,
      include: [serviceInclude, locationInclude],
    });

    const formatted = records.map((r) => {
      const s = r.Service;
      const l = r.Location;
      const stateSlug = l?.State?.slug || '';
      const pagePath = s && l && stateSlug ? `/${stateSlug}/${s.slug}-in-${l.slug}` : null;

      return {
        id: r.id,
        service_id: r.service_id,
        location_id: r.location_id,
        service_name: s?.name,
        service_slug: s?.slug,
        location_name: l?.name,
        location_slug: l?.slug,
        state_slug: stateSlug,
        page_path: pagePath,
        description: r.description,
        content: r.content,
        faqs: r.faqs,
      };
    });

    return jsonResponse({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('AI Gateway Service-Locations GET Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    let {
      path,
      url: inputUrl,
      service,
      service_slug,
      service_name,
      location,
      location_slug,
      location_name,
      city,
      slug,
      description,
      content,
      faqs,
      // Optional SEO synchronization
      seo_title,
      meta_title,
      seo_description,
      meta_description,
      keywords,
    } = body;

    let sSlug = service_slug || (service ? slugify(service) : null) || (service_name ? slugify(service_name) : null);
    let lSlug = location_slug || (location ? slugify(location) : null) || (city ? slugify(city) : null) || (location_name ? slugify(location_name) : null);

    const compositeInput = slug || path || inputUrl;
    if (compositeInput) {
      const parsed = parseServiceAndLocation(compositeInput);
      if (parsed.serviceSlug) sSlug = sSlug || parsed.serviceSlug;
      if (parsed.locationSlug) lSlug = lSlug || parsed.locationSlug;
    }

    if (!sSlug || !lSlug) {
      return jsonResponse(
        {
          success: false,
          error: 'Both service (service_slug/service_name) and location (location_slug/city) are required.',
          example: {
            service_slug: 'residential-moving',
            location_slug: 'calgary',
            description: 'Top-rated residential movers in Calgary...',
            content: '<h3>Stress-Free Moving in Calgary</h3><p>...</p>',
          },
        },
        { status: 400 }
      );
    }

    // Resolve or create Service
    let serviceRecord = await Service.findOne({ where: { slug: sSlug } });
    if (!serviceRecord) {
      const friendlyName = service_name || sSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      serviceRecord = await Service.create({
        name: friendlyName,
        slug: sSlug,
        description: description || `Professional ${friendlyName} services by Galaxy Movers.`,
      });
    }

    // Resolve Location
    let locationRecord = await Location.findOne({
      where: { slug: lSlug },
      include: [{ model: State, attributes: ['id', 'name', 'slug'] }],
    });

    if (!locationRecord) {
      return jsonResponse(
        {
          success: false,
          error: `Location with slug '${lSlug}' was not found. Please create the location first or verify the slug.`,
        },
        { status: 404 }
      );
    }

    const formattedFaqs = faqs ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : null;

    let junction = await ServiceLocation.findOne({
      where: {
        service_id: serviceRecord.id,
        location_id: locationRecord.id,
      },
    });

    if (junction) {
      await junction.update({
        description: description !== undefined ? description : junction.description,
        content: content !== undefined ? content : junction.content,
        faqs: formattedFaqs !== undefined ? formattedFaqs : junction.faqs,
      });
    } else {
      junction = await ServiceLocation.create({
        service_id: serviceRecord.id,
        location_id: locationRecord.id,
        description,
        content,
        faqs: formattedFaqs,
      });
    }

    // Auto-sync SEO if title or description was provided
    const stateSlug = locationRecord.State?.slug;
    let seoUpdated = null;
    if (stateSlug) {
      const pagePath = `/${stateSlug}/${serviceRecord.slug}-in-${locationRecord.slug}`;
      const titleToSave = seo_title || meta_title;
      const descToSave = seo_description || meta_description || description;

      if (titleToSave || descToSave || keywords) {
        const existingSeo = await Seo.findOne({ where: { page_path: pagePath } });
        if (existingSeo) {
          await existingSeo.update({
            title: titleToSave || existingSeo.title,
            description: descToSave || existingSeo.description,
            keywords: keywords || existingSeo.keywords,
          });
          seoUpdated = pagePath;
        } else {
          await Seo.create({
            page_path: pagePath,
            title: titleToSave || `${serviceRecord.name} in ${locationRecord.name} | Galaxy Movers`,
            description: descToSave || `Reliable, affordable ${serviceRecord.name} in ${locationRecord.name}. Get a free quote today!`,
            keywords: keywords || `${serviceRecord.name} ${locationRecord.name}, movers ${locationRecord.name}`,
          });
          seoUpdated = pagePath;
        }
      }
    }

    return jsonResponse({
      success: true,
      message: `Service location for '${serviceRecord.name}' in '${locationRecord.name}' saved successfully.`,
      data: {
        id: junction.id,
        service: serviceRecord.name,
        service_slug: serviceRecord.slug,
        location: locationRecord.name,
        location_slug: locationRecord.slug,
        state_slug: stateSlug,
        seo_path_synced: seoUpdated,
      },
    });
  } catch (error) {
    console.error('AI Gateway Service-Locations POST Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}

export async function PATCH(request) {
  return POST(request);
}

export async function DELETE(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const slugQuery = url.searchParams.get('slug') || url.searchParams.get('path');

    let junction = null;
    if (id) {
      junction = await ServiceLocation.findByPk(id);
    } else if (slugQuery) {
      const parsed = parseServiceAndLocation(slugQuery);
      if (parsed.serviceSlug && parsed.locationSlug) {
        const s = await Service.findOne({ where: { slug: parsed.serviceSlug } });
        const l = await Location.findOne({ where: { slug: parsed.locationSlug } });
        if (s && l) {
          junction = await ServiceLocation.findOne({
            where: { service_id: s.id, location_id: l.id },
          });
        }
      }
    }

    if (!junction) {
      return jsonResponse({ success: false, error: 'ServiceLocation record not found.' }, { status: 404 });
    }

    await junction.destroy();
    return jsonResponse({ success: true, message: 'Service location relation removed successfully.' });
  } catch (error) {
    console.error('AI Gateway Service-Locations DELETE Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}
