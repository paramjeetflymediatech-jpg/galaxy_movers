import { NextResponse } from 'next/server';
import State from '@/models/State';

export async function GET() {
  try {
    const states = await State.findAll({ 
      where: { is_active: true },
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, data: states });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
