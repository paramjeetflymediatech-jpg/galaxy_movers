import { NextResponse } from 'next/server';
import Location from '@/models/Location';
import State from '@/models/State';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const stateId = searchParams.get('stateId');

    const where = {};
    if (districtId) where.district_id = districtId;
    if (stateId) where.state_id = stateId;

    const locations = await Location.findAll({ 
      where,
      include: [{ model: State, attributes: ['slug'] }],
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
