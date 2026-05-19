import Lead from '@/models/Lead';
import Blog from '@/models/Blog';
import Seo from '@/models/Seo';
import { Inbox, BookOpen, Settings, Calendar, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardMain() {
  let leadsCount = 0;
  let blogsCount = 0;
  let seoCount = 0;
  let recentLeads = [];

  try {
    const [leads, blogs, seos] = await Promise.all([
      Lead.count(),
      Blog.count(),
      Seo.count()
    ]);
    leadsCount = leads;
    blogsCount = blogs;
    seoCount = seos;

    const list = await Lead.findAll({
      order: [['createdAt', 'DESC']],
      limit: 3
    });
    recentLeads = list.map(l => l.toJSON());
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
  }

  const statCards = [
    { name: 'Total Quote Requests', value: leadsCount, icon: <Inbox className="h-6 w-6 text-red-500" />, href: '/admin/dashboard/leads' },
    { name: 'Active Blogs', value: blogsCount, icon: <BookOpen className="h-6 w-6 text-red-500" />, href: '/admin/dashboard/blogs' },
    { name: 'Configured SEO Paths', value: seoCount, icon: <Settings className="h-6 w-6 text-red-500" />, href: '/admin/dashboard/seo' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-gray-800">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black">Welcome Back, Administrator</h1>
          <p className="text-gray-400 text-sm font-semibold max-w-xl leading-relaxed">
            Monitor incoming relocation quote queries, curate the educational moving blog network, and inject Google Tracking or SEO tags dynamically in one central control hub.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx}
            className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {card.name}
              </span>
              <span className="text-3xl font-black text-gray-900 block leading-none">
                {card.value}
              </span>
              <Link 
                href={card.href}
                className="inline-flex items-center text-xs font-extrabold text-red-600 hover:text-red-700 tracking-wide uppercase pt-1"
              >
                <span>Manage</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl text-red-600 shadow-inner">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-gray-900 tracking-tight">
              Recent Quote Submissions
            </h3>
            <p className="text-xs text-gray-400 font-semibold">
              The latest leads received from the free quotes form.
            </p>
          </div>
          <Link
            href="/admin/dashboard/leads"
            className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full"
          >
            View All
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-10 bg-gray-55/40 border border-gray-100 rounded-xl">
            <p className="text-gray-400 text-sm font-semibold">No recent submissions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="pb-3.5 pl-2">Customer</th>
                  <th className="pb-3.5">Moving Date</th>
                  <th className="pb-3.5">Route</th>
                  <th className="pb-3.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-2 font-bold text-gray-900">
                      <div className="flex flex-col">
                        <span>{lead.fullName}</span>
                        <span className="text-xs text-gray-400 font-semibold mt-0.5">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-gray-700">
                      <span className="inline-flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {lead.movingDate}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-gray-700">
                      <span>{lead.movingFrom} &rarr; {lead.movingTo}</span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <Link 
                        href="/admin/dashboard/leads"
                        className="inline-flex items-center text-xs font-extrabold text-red-600 hover:bg-red-50 py-1.5 px-3.5 rounded-full transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
