import { NextResponse } from 'next/server';
import ServiceLocation from '@/models/ServiceLocation';
import Service from '@/models/Service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
      return NextResponse.json({ success: false, error: 'locationId is required' }, { status: 400 });
    }

    const serviceLocations = await ServiceLocation.findAll({
      where: { location_id: locationId },
      include: [
        {
          model: Service,
          attributes: ['id', 'name', 'slug', 'description']
        }
      ]
    });

    // Format output to be an array of services with mapped fields
    const services = serviceLocations
      .filter(sl => sl.Service !== null)
      .map(sl => ({
        id: sl.Service.id,
        name: sl.Service.name,
        slug: sl.Service.slug,
        description: sl.Service.description || sl.description
      }));

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services for location:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
