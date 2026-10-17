import Location from '@/models/Location';
import State from '@/models/State';
import District from '@/models/District';
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
    const stateSlug = url.searchParams.get('state');

    if (slug) {
      const location = await Location.findOne({
        where: { slug: slugify(slug) },
        include: [
          { model: State, attributes: ['id', 'name', 'slug'] },
          { model: District, attributes: ['id', 'name'] },
        ],
      });
      if (!location) {
        return jsonResponse({ success: false, message: `Location with slug '${slug}' not found.` }, { status: 404 });
      }
      return jsonResponse({ success: true, data: location });
    }

    const where = {};
    const stateInclude = { model: State, attributes: ['id', 'name', 'slug'] };
    if (stateSlug) {
      stateInclude.where = { slug: stateSlug.trim().toLowerCase() };
    }

    const locations = await Location.findAll({
      where,
      include: [
        stateInclude,
        { model: District, attributes: ['id', 'name'] },
      ],
      order: [['name', 'ASC']],
    });

    return jsonResponse({ success: true, count: locations.length, data: locations });
  } catch (error) {
    console.error('AI Gateway Locations GET Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    let { name, slug, state_id, state_slug, district_id } = body;

    if (!name) {
      return jsonResponse({ success: false, error: 'name is required.' }, { status: 400 });
    }

    const targetSlug = slug ? slugify(slug) : slugify(name);

    let stateId = state_id;
    if (!stateId && state_slug) {
      const stateObj = await State.findOne({ where: { slug: slugify(state_slug) } });
      if (stateObj) stateId = stateObj.id;
    }

    const existing = await Location.findOne({ where: { slug: targetSlug } });

    if (existing) {
      await existing.update({
        name,
        state_id: stateId || existing.state_id,
        district_id: district_id !== undefined ? district_id : existing.district_id,
      });

      return jsonResponse({
        success: true,
        message: `Location '${name}' updated successfully.`,
        data: existing,
      });
    }

    const newLocation = await Location.create({
      name,
      slug: targetSlug,
      state_id: stateId || null,
      district_id: district_id || null,
    });

    return jsonResponse(
      {
        success: true,
        message: `Location '${name}' created successfully.`,
        data: newLocation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('AI Gateway Locations POST Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}

export async function PATCH(request) {
  return POST(request);
}
