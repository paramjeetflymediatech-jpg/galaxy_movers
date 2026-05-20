'use client';

import { useState } from 'react';
import { Search, Calendar, Phone, Mail, MapPin, X, FileText, CheckCircle2 } from 'lucide-react';

export default function LeadsTable({ initialLeads }) {
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Search filtering logic
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.movingFrom.toLowerCase().includes(query) ||
      lead.movingTo.toLowerCase().includes(query) ||
      lead.phone.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by name, email, route cities..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-gray-55 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 pl-11 pr-4 rounded-xl focus:outline-none transition-all font-semibold"
        />
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-sm">No quote requests found matching your query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="py-3 px-4">Customer Info</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Moving Route</th>
                <th className="py-3 px-4">Moving Date</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-55/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">
                    <span className="block leading-snug">{lead.fullName}</span>
                    <span className="block text-[11px] text-gray-450 font-bold tracking-wide uppercase mt-0.5">
                      Lead #{lead.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        {lead.phone}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-400 mt-1 font-medium select-all">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        {lead.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span>{lead.movingFrom} &rarr; {lead.movingTo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    <span className="inline-flex items-center bg-gray-50 border border-gray-100 py-1 px-2.5 rounded-lg text-xs">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-red-600" />
                      {formatDate(lead.movingDate)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      type="button"
                      className="bg-red-50 hover:bg-red-600 text-red-650 hover:text-white py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 border-t border-gray-100 gap-4 text-xs font-bold text-gray-500">
              <div>
                Showing <span className="text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="text-gray-900">{filteredLeads.length}</span> entries
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer text-gray-750"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = currentPage - 2 + idx;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-red-600 border-red-650 text-white shadow-md shadow-red-600/10'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer text-gray-750"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inspect Detail Modal overlay */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative border-b border-gray-800">
              <div className="flex items-center space-x-2.5">
                <div className="bg-red-600 p-1.5 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  Quote Details #{selectedLead.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                type="button"
                className="hover:text-red-500 transition-colors p-1.5 hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div className="border-b border-gray-50 pb-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                  Customer
                </span>
                <span className="text-lg font-black text-gray-900 block leading-tight">
                  {selectedLead.fullName}
                </span>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Phone Number
                  </span>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm font-bold text-red-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Email Address
                  </span>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-bold text-red-600 hover:underline break-all">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Moving Date
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {formatDate(selectedLead.movingDate)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                    Submission Time
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    {formatDate(selectedLead.createdAt)}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Moving From
                  </span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedLead.movingFrom}</span>
                </div>
                <div className="text-red-500 font-black text-base shrink-0">&rarr;</div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Moving To
                  </span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedLead.movingTo}</span>
                </div>
              </div>

              {/* Additional details */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                  Additional Moving Details
                </span>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-sm font-medium text-gray-600 leading-relaxed min-h-[80px]">
                  {selectedLead.details || 'No additional specifications provided.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                type="button"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
