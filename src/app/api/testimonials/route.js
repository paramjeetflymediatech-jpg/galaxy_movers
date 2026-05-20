import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    const list = await Testimonial.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
    return NextResponse.json({ success: true, reviews: list });
  } catch (error) {
    console.error('Public Testimonials Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
