import Lead from '@/models/Lead';
import LeadsTable from './LeadsTable';

export default async function LeadsManager() {
  let leads = [];

  try {
    const list = await Lead.findAll({
      order: [['createdAt', 'DESC']]
    });
    leads = list.map(l => l.toJSON());
  } catch (err) {
    console.error('Error fetching leads inside LeadsManager:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Quote Requests Tracker
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Review and coordinate incoming moving quote submissions from the free quotes form.
        </p>
      </div>

      {/* Leads interactive data-table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 overflow-hidden">
        <LeadsTable initialLeads={leads} />
      </div>

    </div>
  );
}
