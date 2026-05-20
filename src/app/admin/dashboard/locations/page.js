import State from '@/models/State';
import District from '@/models/District';
import Location from '@/models/Location';
import LocationsManager from './LocationsManager';

export default async function AdminLocationsPage() {
  let states = [];
  let districts = [];
  let locations = [];

  try {
    // Fetch states
    const statesList = await State.findAll({
      order: [['name', 'ASC']]
    });
    states = statesList.map(s => s.toJSON());

    // Fetch districts with their parent State association
    const districtsList = await District.findAll({
      include: [
        {
          model: State,
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['name', 'ASC']]
    });
    districts = districtsList.map(d => d.toJSON());

    // Fetch locations (cities) with state and district associations
    const locationsList = await Location.findAll({
      include: [
        {
          model: State,
          attributes: ['id', 'name', 'slug']
        },
        {
          model: District,
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    locations = locationsList.map(l => l.toJSON());

  } catch (err) {
    console.error('Error fetching data inside AdminLocationsPage:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Manage States, Districts & Cities
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Create, edit, and organize Provinces (States), Regions (Districts) and Cities (Locations) to configure dynamic catchment pages.
        </p>
      </div>

      {/* Interactive Manager */}
      <LocationsManager 
        initialStates={states} 
        initialDistricts={districts} 
        initialLocations={locations} 
      />

    </div>
  );
}
