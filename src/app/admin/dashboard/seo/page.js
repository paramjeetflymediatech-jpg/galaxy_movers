import Seo from '@/models/Seo';
import SeoManager from './SeoManager';

export default async function AdminSeoPage() {
  let seoRecords = [];

  try {
    const list = await Seo.findAll({
      order: [['page_path', 'ASC']]
    });
    seoRecords = list.map(s => s.toJSON());
  } catch (err) {
    console.error('Error fetching SEO configurations inside AdminSeoPage server component:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          SEO & Analytics Scripts Manager
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Configure search engine title tags, descriptions, keywords, and inject Google Tag Manager, Google Analytics, or custom header/footer scripts on a per-pathname basis.
        </p>
      </div>

      {/* SEO Interactive customizer container */}
      <SeoManager initialRecords={seoRecords} />

    </div>
  );
}
