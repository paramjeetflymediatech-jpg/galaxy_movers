import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

// GET all testimonials (for admin display)
export async function GET() {
  try {
    const list = await Testimonial.findAll({
      order: [['created_at', 'DESC']]
    });
    return NextResponse.json({ success: true, data: list });
  } catch (err) {
    console.error('Error fetching testimonials in admin API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST a new testimonial manually
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, location, rating, date, content, avatar_url } = body;

    if (!name || !content) {
      return NextResponse.json({ success: false, error: 'Name and content are required' }, { status: 400 });
    }

    const newTestimonial = await Testimonial.create({
      name,
      location: location || 'Verified Customer',
      rating: parseInt(rating) || 5,
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      content,
      avatar_url: avatar_url || null,
      is_active: true
    });

    return NextResponse.json({ success: true, data: newTestimonial });
  } catch (err) {
    console.error('Error creating manual testimonial in admin API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
