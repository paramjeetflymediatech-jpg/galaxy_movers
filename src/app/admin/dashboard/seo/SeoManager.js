'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Settings, X, Check, Loader2, Code2, ShieldAlert } from 'lucide-react';

export default function SeoManager({ initialRecords }) {
  const [records, setRecords] = useState(initialRecords);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [recordId, setRecordId] = useState(null);
  const [pagePath, setPagePath] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [headerScripts, setHeaderScripts] = useState('');
  const [footerScripts, setFooterScripts] = useState('');

  const handleOpenCreate = () => {
    setRecordId(null);
    setPagePath('');
    setTitle('');
    setDescription('');
    setKeywords('');
    setCanonicalUrl('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setHeaderScripts('');
    setFooterScripts('');
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleOpenEdit = (rec) => {
    setRecordId(rec.id);
    setPagePath(rec.page_path);
    setTitle(rec.title || '');
    setDescription(rec.description || '');
    setKeywords(rec.keywords || '');
    setCanonicalUrl(rec.canonical_url || '');
    setOgTitle(rec.og_title || '');
    setOgDescription(rec.og_description || '');
    setOgImage(rec.og_image || '');
    setHeaderScripts(rec.header_scripts || '');
    setFooterScripts(rec.footer_scripts || '');
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: recordId,
      page_path: pagePath.trim(),
      title: title.trim(),
      description: description.trim(),
      keywords: keywords.trim(),
      canonical_url: canonicalUrl.trim(),
      og_title: ogTitle.trim() || title.trim(),
      og_description: ogDescription.trim() || description.trim(),
      og_image: ogImage.trim(),
      header_scripts: headerScripts,
      footer_scripts: footerScripts
    };

    try {
      const method = recordId ? 'PUT' : 'POST';
      const res = await fetch('/api/seo', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save SEO config.');
      }

      if (recordId) {
        setRecords(records.map((r) => (r.id === recordId ? data.record : r)));
      } else {
        setRecords([...records, data.record]);
      }

      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSeo = async (rec) => {
    if (rec.page_path === '/') {
      alert('Root path (/) is required as the default metadata fallback and cannot be deleted.');
      return;
    }

    if (confirm(`Delete SEO configuration settings for "${rec.page_path}"?`)) {
      try {
        const res = await fetch(`/api/seo?id=${rec.id}`, { method: 'DELETE' });
        if (res.ok) {
          setRecords(records.filter((r) => r.id !== rec.id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete SEO settings.');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control bar */}
      {!isEditing && (
        <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-500">
            {records.length} Page Paths Configured
          </span>
          <button
            onClick={handleOpenCreate}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 mr-1.5" />
            <span>Configure Path</span>
          </button>
        </div>
      )}

      {isEditing ? (
        // EDIT / CREATE FORM OVERLAY
        <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="font-extrabold text-lg text-gray-900">
              {recordId ? `Configure Path: ${pagePath}` : 'Configure New Page Path SEO'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              type="button"
              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-55 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Path and Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Page Path (e.g. /blog/tips or /)
                </label>
                <input
                  type="text"
                  required
                  disabled={!!recordId} // Block key path modifications on edit
                  value={pagePath}
                  onChange={(e) => setPagePath(e.target.value)}
                  placeholder="e.g. /services/packing"
                  className="w-full bg-gray-50 border border-gray-150 disabled:bg-gray-100 disabled:text-gray-500 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Galaxy Movers | Canada\'s Moving Specialists"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>

            {/* Keywords and Canonical */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="moving canada, local movers, packing service"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Canonical URL (self-referencing or custom tag)
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://galaxymovers.ca/services/packing"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Meta Description (Search Snippet Description)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a clear, structured summary describing the specific page services to users on search results pages..."
                rows="2"
                className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800 resize-none"
              ></textarea>
            </div>

            {/* Social Sharing OpenGraph Tags */}
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500 block">
                OpenGraph / Social Media Meta Customizer
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">OG Title</label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Custom Social Post Title"
                    className="bg-white border border-gray-150 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">OG Image URL</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/share-image.jpg"
                    className="bg-white border border-gray-150 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* RAW SCRIPTS DIRECT INJECTION PANEL */}
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                <Code2 className="h-4 w-4 text-red-500" />
                <span>Raw Analytics/Tracking Script Injections</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Header scripts */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Header Script Blocks (&lt;head&gt;)
                    </label>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Raw JS / GTM Blocks</span>
                  </div>
                  <textarea
                    value={headerScripts}
                    onChange={(e) => setHeaderScripts(e.target.value)}
                    placeholder="e.g. <!-- Google Tag Manager --> <script>...</script>"
                    rows="3"
                    className="w-full bg-white border border-gray-150 focus:border-red-500 text-xs py-2.5 px-4 rounded-lg focus:outline-none font-mono text-gray-700 resize-none"
                  ></textarea>
                </div>

                {/* Footer scripts */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Footer Script Blocks (Body Footer)
                    </label>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Chatbots / Styles</span>
                  </div>
                  <textarea
                    value={footerScripts}
                    onChange={(e) => setFooterScripts(e.target.value)}
                    placeholder="e.g. <script src='https://cdn.chatbot...'></script>"
                    rows="3"
                    className="w-full bg-white border border-gray-150 focus:border-red-500 text-xs py-2.5 px-4 rounded-lg focus:outline-none font-mono text-gray-700 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2.5 px-7 rounded-lg text-sm shadow-lg hover:shadow-red-600/15 flex items-center transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    <span>Save Config</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      ) : (
        // SEO PATHS LIST VIEW
        <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">Page PathName</th>
                  <th className="py-3 px-4">Meta Title Tag</th>
                  <th className="py-3 px-4">Script Injection Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-black text-gray-900">
                      <span className="bg-gray-100/60 border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-xs leading-none">
                        {rec.page_path}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-600 truncate max-w-xs">
                      {rec.title}
                    </td>
                    <td className="py-4 px-4 font-bold">
                      <div className="flex flex-col space-y-1 text-[10px] uppercase tracking-wider">
                        <span className={`inline-flex items-center w-fit rounded-full px-2 py-0.5 ${
                          rec.header_scripts
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          Header: {rec.header_scripts ? 'Active (GTM)' : 'None'}
                        </span>
                        <span className={`inline-flex items-center w-fit rounded-full px-2 py-0.5 ${
                          rec.footer_scripts
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          Footer: {rec.footer_scripts ? 'Active (Widget)' : 'None'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2.5">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          type="button"
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-150 p-2 rounded-lg cursor-pointer transition-colors"
                          aria-label="Edit SEO"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-red-600" />
                        </button>
                        
                        <button
                          disabled={rec.page_path === '/'}
                          onClick={() => handleDeleteSeo(rec)}
                          type="button"
                          className={`p-2 rounded-lg transition-colors ${
                            rec.page_path === '/'
                              ? 'text-gray-300 bg-gray-50 cursor-not-allowed border border-gray-100'
                              : 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white cursor-pointer'
                          }`}
                          aria-label="Delete SEO"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
