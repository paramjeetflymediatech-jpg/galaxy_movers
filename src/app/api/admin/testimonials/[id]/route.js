import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

// PATCH update testimonial (is_active toggle or edit details)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    await testimonial.update(body);
    return NextResponse.json({ success: true, data: testimonial });
  } catch (err) {
    console.error('Error updating testimonial by ID:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE a testimonial
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    await testimonial.destroy();
    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
