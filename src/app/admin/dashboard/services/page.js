import Service from '@/models/Service';
import ServicesManager from './ServicesManager';

export default async function AdminServicesPage() {
  let services = [];

  try {
    const list = await Service.findAll({
      order: [['name', 'ASC']]
    });
    services = list.map(s => s.toJSON());
  } catch (err) {
    console.error('Error fetching services inside AdminServicesPage server component:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Moving Services & Specialties
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Create, edit, and organize dynamic service landing pages, custom HTML body copy, and target FAQs.
        </p>
      </div>

      {/* Services Interactive CRUD Container */}
      <ServicesManager initialServices={services} />

    </div>
  );
}
