import { NextResponse } from 'next/server';
import State from '@/models/State';
import { verifyToken } from '@/lib/auth';

// Retrieve all states
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const states = await State.findAll({
      order: [['name', 'ASC']]
    });
    return NextResponse.json({ success: true, data: states }, { status: 200 });
  } catch (err) {
    console.error('Admin States GET API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during states retrieval.' }, { status: 500 });
  }
}

// Create or update a state
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, is_active } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Name and slug are required fields.' }, { status: 400 });
    }

    if (id) {
      // Update
      const state = await State.findByPk(id);
      if (!state) {
        return NextResponse.json({ success: false, message: 'State not found.' }, { status: 404 });
      }
      await state.update({ name, slug, is_active: is_active !== undefined ? is_active : true });
      return NextResponse.json({ success: true, message: 'State updated successfully.', state }, { status: 200 });
    } else {
      // Create
      const state = await State.create({ name, slug, is_active: is_active !== undefined ? is_active : true });
      return NextResponse.json({ success: true, message: 'State created successfully.', state }, { status: 201 });
    }
  } catch (err) {
    console.error('Admin States POST API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during state save.' }, { status: 500 });
  }
}

// Delete a state
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'State ID is required.' }, { status: 400 });
    }

    const state = await State.findByPk(id);
    if (!state) {
      return NextResponse.json({ success: false, message: 'State not found.' }, { status: 404 });
    }

    await state.destroy();
    return NextResponse.json({ success: true, message: 'State deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Admin States DELETE API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during state deletion.' }, { status: 500 });
  }
}
