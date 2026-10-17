import Service from '@/models/Service';
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

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (id) {
      const service = await Service.findByPk(id);
      if (!service) {
        return jsonResponse({ success: false, message: `Service with ID ${id} not found.` }, { status: 404 });
      }
      return jsonResponse({ success: true, data: service });
    }

    if (slug) {
      const service = await Service.findOne({ where: { slug: slugify(slug) } });
      if (!service) {
        return jsonResponse({ success: false, message: `Service with slug '${slug}' not found.` }, { status: 404 });
      }
      return jsonResponse({ success: true, data: service });
    }

    const services = await Service.findAll({
      order: [['name', 'ASC']],
    });

    return jsonResponse({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error('AI Gateway Services GET Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    let { name, slug, description, content, faqs } = body;

    if (!name) {
      return jsonResponse({ success: false, error: 'name is required.' }, { status: 400 });
    }

    const targetSlug = slug ? slugify(slug) : slugify(name);
    const formattedFaqs = faqs ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : null;

    const existing = await Service.findOne({ where: { slug: targetSlug } });

    if (existing) {
      await existing.update({
        name,
        description: description !== undefined ? description : existing.description,
        content: content !== undefined ? content : existing.content,
        faqs: formattedFaqs !== undefined ? formattedFaqs : existing.faqs,
      });

      return jsonResponse({
        success: true,
        message: `Service '${name}' updated successfully.`,
        data: existing,
      });
    }

    const newService = await Service.create({
      name,
      slug: targetSlug,
      description,
      content,
      faqs: formattedFaqs,
    });

    return jsonResponse(
      {
        success: true,
        message: `Service '${name}' created successfully.`,
        data: newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('AI Gateway Services POST Error:', error);
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
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    let service = null;
    if (id) {
      service = await Service.findByPk(id);
    } else if (slug) {
      service = await Service.findOne({ where: { slug: slugify(slug) } });
    }

    if (!service) {
      return jsonResponse({ success: false, error: 'Service not found.' }, { status: 404 });
    }

    await service.destroy();
    return jsonResponse({ success: true, message: `Service '${service.name}' deleted successfully.` });
  } catch (error) {
    console.error('AI Gateway Services DELETE Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}
