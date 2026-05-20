import { NextResponse } from 'next/server';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';

// Retrieve all services
export async function GET(req) {
  try {
    const services = await Service.findAll({
      order: [['name', 'ASC']]
    });
    return NextResponse.json({ success: true, data: services }, { status: 200 });
  } catch (err) {
    console.error('Services GET API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during services retrieval.' }, { status: 500 });
  }
}

// Create or update a service
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, description, content, faqs } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Name and slug are required fields.' }, { status: 400 });
    }

    if (id) {
      // Update
      const service = await Service.findByPk(id);
      if (!service) {
        return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
      }
      await service.update({ name, slug, description, content, faqs });
      return NextResponse.json({ success: true, message: 'Service updated successfully.', service }, { status: 200 });
    } else {
      // Create
      const service = await Service.create({ name, slug, description, content, faqs });
      return NextResponse.json({ success: true, message: 'Service created successfully.', service }, { status: 201 });
    }
  } catch (err) {
    console.error('Services POST API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during service save.' }, { status: 500 });
  }
}

// Delete a service
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required.' }, { status: 400 });
    }

    const service = await Service.findByPk(id);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    await service.destroy();
    return NextResponse.json({ success: true, message: 'Service deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Services DELETE API error:', err);
    return NextResponse.json({ success: false, message: 'Server error during service deletion.' }, { status: 500 });
  }
}
