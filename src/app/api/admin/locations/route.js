import { NextResponse } from 'next/server';
import Location from '@/models/Location';
import State from '@/models/State';
import District from '@/models/District';
import { verifyToken } from '@/lib/auth';

// Retrieve all locations/cities
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const locations = await Location.findAll({
      include: [
        {
          model: State,
          attributes: ['id', 'name', 'slug']
        },
        {
          model: District,
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    return NextResponse.json({ success: true, data: locations }, { status: 200 });
  } catch (err) {
    console.error('Admin Locations GET API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during locations retrieval.' }, { status: 500 });
  }
}

// Create or update a location/city
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, state_id, district_id } = body;

    if (!name || !slug || !state_id || !district_id) {
      return NextResponse.json({ success: false, message: 'Name, Slug, State, and District are required fields.' }, { status: 400 });
    }

    if (id) {
      // Update
      const loc = await Location.findByPk(id);
      if (!loc) {
        return NextResponse.json({ success: false, message: 'Location not found.' }, { status: 404 });
      }
      await loc.update({ name, slug, state_id: Number(state_id), district_id: Number(district_id) });
      return NextResponse.json({ success: true, message: 'Location updated successfully.', location: loc }, { status: 200 });
    } else {
      // Create
      const loc = await Location.create({ name, slug, state_id: Number(state_id), district_id: Number(district_id) });
      return NextResponse.json({ success: true, message: 'Location created successfully.', location: loc }, { status: 201 });
    }
  } catch (err) {
    console.error('Admin Locations POST API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during location save.' }, { status: 500 });
  }
}

// Delete a location/city
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Location ID is required.' }, { status: 400 });
    }

    const loc = await Location.findByPk(id);
    if (!loc) {
      return NextResponse.json({ success: false, message: 'Location not found.' }, { status: 404 });
    }

    await loc.destroy();
    return NextResponse.json({ success: true, message: 'Location deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Admin Locations DELETE API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during location deletion.' }, { status: 500 });
  }
}
