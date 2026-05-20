'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Edit2, Trash2, FileText, X, Check, ArrowRight, Loader2, ListPlus, Briefcase, HelpCircle } from 'lucide-react';

// Dynamically import rich text editor to prevent Next.js SSR build errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function ServicesManager({ initialServices }) {
  const [services, setServices] = useState(initialServices);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [serviceId, setServiceId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [faqs, setFaqs] = useState([]); // [{ q: '', a: '' }]

  // FAQ input helpers
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  // Auto slugify helper
  const handleNameChange = (val) => {
    setName(val);
    if (!serviceId) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
      );
    }
  };

  const handleOpenCreate = () => {
    setServiceId(null);
    setName('');
    setSlug('');
    setDescription('');
    setContent('');
    setFaqs([]);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleOpenEdit = (svc) => {
    setServiceId(svc.id);
    setName(svc.name);
    setSlug(svc.slug);
    setDescription(svc.description || '');
    setContent(svc.content || '');
    
    let parsedFaqs = [];
    if (svc.faqs) {
      try {
        parsedFaqs = JSON.parse(svc.faqs);
      } catch (e) {
        parsedFaqs = [];
      }
    }
    setFaqs(parsedFaqs);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleAddFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    setFaqs([...faqs, { q: faqQ.trim(), a: faqA.trim() }]);
    setFaqQ('');
    setFaqA('');
  };

  const handleRemoveFaq = (idx) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: serviceId,
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description,
      content,
      faqs: JSON.stringify(faqs)
    };

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save service.');
      }

      // Update local state list
      if (serviceId) {
        setServices(services.map((s) => (s.id === serviceId ? data.service : s)));
      } else {
        setServices([...services, data.service].sort((a, b) => a.name.localeCompare(b.name)));
      }

      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (confirm('Are you absolutely sure you want to delete this service? All locations offering this service may be affected. This action is permanent.')) {
      try {
        const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setServices(services.filter((s) => s.id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete service.');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header bar */}
      {!isEditing && (
        <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-500">
            {services.length} Services Configured
          </span>
          <button
            onClick={handleOpenCreate}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 mr-1.5" />
            <span>Create Service</span>
          </button>
        </div>
      )}

      {isEditing ? (
        // EDIT / CREATE FORM OVERLAY
        <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="font-extrabold text-lg text-gray-900">
              {serviceId ? 'Edit Service Details' : 'Configure New Service'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              type="button"
              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveService} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Residential Moving"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. residential-moving"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Short Description (Card Teaser)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief, engaging 2-sentence teaser explaining what the service handles..."
                rows="2"
                className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold resize-none text-gray-800"
              ></textarea>
            </div>

            {/* Rich Text Editor */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Landing Page Content (HTML Rich Text)
              </label>
              <div className="prose prose-sm max-w-none border border-gray-150 rounded-xl overflow-hidden min-h-[300px]">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'clean']
                    ]
                  }}
                  className="bg-white min-h-[250px]"
                />
              </div>
            </div>

            {/* FAQ Builder */}
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <span className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                <ListPlus className="h-4 w-4 text-red-500" />
                <span>Service FAQ Schema Builder</span>
              </span>

              {/* Input row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Question (e.g. Do you handle piano moves?)"
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  className="bg-white border border-gray-150 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Answer text..."
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    className="flex-grow bg-white border border-gray-150 text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                  />
                  <button
                    onClick={handleAddFaq}
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* FAQs Preview */}
              {faqs.length > 0 && (
                <div className="divide-y divide-gray-100 border border-gray-100 bg-white rounded-xl overflow-hidden shadow-inner">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-3.5 flex justify-between items-start gap-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1">
                        <span className="block font-black text-gray-900">Q: {faq.q}</span>
                        <span className="block text-gray-500 font-medium">A: {faq.a}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFaq(index)}
                        type="button"
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Form Actions */}
            <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancel Changes
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
                    <span>Save Service</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      ) : (
        // SERVICES GRID LISTING
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white border border-gray-150 rounded-2xl">
              <p className="text-gray-400 text-sm font-semibold">No services configured yet. Add your first service specialty!</p>
            </div>
          ) : (
            services.map((svc) => (
              <div 
                key={svc.id} 
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                    <Briefcase className="h-3.5 w-3.5 text-red-500" />
                    <span>Active Route</span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">
                    {svc.name}
                  </h3>
                  
                  <p className="text-xs text-gray-400 font-semibold tracking-wide truncate">
                    Slug: <span className="text-gray-500">/services/{svc.slug}</span>
                  </p>

                  <p className="text-xs text-gray-400 font-medium line-clamp-2 mt-1">
                    {svc.description || 'No description provided.'}
                  </p>
                </div>

                {/* Card footer actions */}
                <div className="p-5 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    type="button"
                    className="flex-grow bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-red-600" />
                    <span>Edit Service</span>
                  </button>

                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    type="button"
                    className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
                    aria-label="Delete service"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
