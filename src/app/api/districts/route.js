import { NextResponse } from 'next/server';
import District from '@/models/District';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');
    
    const where = stateId ? { state_id: stateId } : {};
    const districts = await District.findAll({ 
      where,
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, data: districts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
