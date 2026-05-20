import { NextResponse } from 'next/server';
import District from '@/models/District';
import State from '@/models/State';
import { verifyToken } from '@/lib/auth';

// Retrieve all districts
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const districts = await District.findAll({
      include: [
        {
          model: State,
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['name', 'ASC']]
    });
    return NextResponse.json({ success: true, data: districts }, { status: 200 });
  } catch (err) {
    console.error('Admin Districts GET API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during districts retrieval.' }, { status: 500 });
  }
}

// Create or update a district
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, state_id } = body;

    if (!name || !state_id) {
      return NextResponse.json({ success: false, message: 'Name and State are required fields.' }, { status: 400 });
    }

    if (id) {
      // Update
      const district = await District.findByPk(id);
      if (!district) {
        return NextResponse.json({ success: false, message: 'District not found.' }, { status: 404 });
      }
      await district.update({ name, state_id });
      return NextResponse.json({ success: true, message: 'District updated successfully.', district }, { status: 200 });
    } else {
      // Create
      const district = await District.create({ name, state_id });
      return NextResponse.json({ success: true, message: 'District created successfully.', district }, { status: 201 });
    }
  } catch (err) {
    console.error('Admin Districts POST API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during district save.' }, { status: 500 });
  }
}

// Delete a district
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'District ID is required.' }, { status: 400 });
    }

    const district = await District.findByPk(id);
    if (!district) {
      return NextResponse.json({ success: false, message: 'District not found.' }, { status: 404 });
    }

    await district.destroy();
    return NextResponse.json({ success: true, message: 'District deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Admin Districts DELETE API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during district deletion.' }, { status: 500 });
  }
}
