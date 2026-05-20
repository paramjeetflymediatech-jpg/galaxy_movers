'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Trash2, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar, 
  User, 
  ArrowRight,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function TestimonialsManager({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'sync' | 'manual'
  
  // Manual Form State
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: '5',
    date: '',
    content: '',
    avatar_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  // Sync Form State
  const [syncConfig, setSyncConfig] = useState({
    placeId: '',
    apiKey: '',
    isDemo: false
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // API Call: Toggle Active Status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
      } else {
        alert('Failed to update status: ' + data.error);
      }
    } catch (err) {
      console.error('Error toggling testimonial status:', err);
    }
  };

  // API Call: Delete Testimonial
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  // API Call: Submit Manual Testimonial
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        setReviews([data.data, ...reviews]);
        setForm({
          name: '',
          location: '',
          rating: '5',
          date: '',
          content: '',
          avatar_url: ''
        });
        setFormMessage({ type: 'success', text: 'Testimonial added successfully!' });
        setTimeout(() => setActiveTab('list'), 1500);
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to add testimonial' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // API Call: Sync Google Reviews
  const handleGoogleSync = async (e) => {
    e.preventDefault();
    
    if (!syncConfig.isDemo && (!syncConfig.placeId || !syncConfig.apiKey)) {
      setSyncStatus({ type: 'error', text: 'Please fill in both Place ID and API Key, or select Simulator mode.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const res = await fetch('/api/admin/testimonials/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncConfig)
      });
      const data = await res.json();

      if (data.success) {
        setSyncStatus({ 
          type: 'success', 
          text: `${data.message} Average Rating: ${data.rating || '5.0'} (${data.total_reviews || '10+'} reviews total)`
        });
        
        // Refresh local review list
        const listRes = await fetch('/api/admin/testimonials');
        const listData = await listRes.json();
        if (listData.success) {
          setReviews(listData.data || []);
        }
      } else {
        setSyncStatus({ type: 'error', text: data.message || 'Synchronization failed.' });
      }
    } catch (err) {
      setSyncStatus({ type: 'error', text: 'Connection timeout or network failure.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'list' 
              ? 'border-red-650 text-red-650' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Active Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sync' 
              ? 'border-red-650 text-red-650' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database size={15} />
          Sync Google Reviews
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'manual' 
              ? 'border-red-650 text-red-650' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Plus size={15} />
          Add Manually
        </button>
      </div>

      {/* Content Areas */}
      
      {/* 1. Review List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-extrabold text-gray-800">No Reviews Saved</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                Import from Google Reviews or add testimonials manually to display them to your site visitors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div 
                  key={r.id} 
                  className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                    r.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50/10 opacity-75'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-150 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
                          {r.avatar_url ? (
                            <img src={r.avatar_url} alt={r.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-4.5 w-4.5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">{r.name}</h4>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                            <MapPin size={10} className="text-gray-400" />
                            <span>{r.location || 'Verified Customer'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleActive(r.id, r.is_active)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            r.is_active 
                              ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                          }`}
                          title={r.is_active ? 'Deactivate (Hide)' : 'Activate (Show)'}
                        >
                          {r.is_active ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 bg-red-50 border border-red-200 text-red-650 rounded-lg hover:bg-red-100 transition-all cursor-pointer"
                          title="Delete Permanently"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Stars & Date */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} 
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                        <Calendar size={11} />
                        <span>{r.date || 'Recently'}</span>
                      </div>
                      {r.google_review_id && (
                        <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 py-0.5 px-2 rounded-full font-bold uppercase tracking-widest">
                          Google Review
                        </span>
                      )}
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-gray-600 font-medium italic leading-relaxed">
                      "{r.content}"
                    </p>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span>Added: {new Date(r.created_at || r.createdAt).toLocaleDateString()}</span>
                    <span>Status: {r.is_active ? <span className="text-green-600">Active</span> : <span className="text-red-500">Hidden</span>}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Google Sync Tab */}
      {activeTab === 'sync' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Database className="text-red-650" size={20} />
                <span>Google Places Sync Settings</span>
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Connect your business profile. This updates/upserts your stored reviews by calling the Google Maps Places API.
              </p>
            </div>

            <form onSubmit={handleGoogleSync} className="space-y-4">
              
              {/* Option toggle: API vs Simulator */}
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-gray-800">Simulate Local Google Reviews</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                    Simulate reviews for Calgary, Vancouver, and Toronto hubs if no key exists.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSyncConfig({ ...syncConfig, isDemo: !syncConfig.isDemo })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    syncConfig.isDemo ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      syncConfig.isDemo ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {!syncConfig.isDemo && (
                <div className="space-y-4">
                  {/* Place ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                      Google Maps Place ID
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. ChIJL2-cTswK10wR8ZJz..." 
                      value={syncConfig.placeId}
                      onChange={(e) => setSyncConfig({ ...syncConfig, placeId: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650"
                    />
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Lookup your unique Maps node ID via Google's Place ID Finder utility.
                    </p>
                  </div>

                  {/* API Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex justify-between items-center">
                      <span>Google API Key</span>
                      <button 
                        type="button" 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-[10px] text-red-650 hover:underline font-bold"
                      >
                        {showApiKey ? <span className="flex items-center gap-1"><EyeOff size={12} /> Hide</span> : <span className="flex items-center gap-1"><Eye size={12} /> Show</span>}
                      </button>
                    </label>
                    <div className="relative">
                      <input 
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="AIzaSy..." 
                        value={syncConfig.apiKey}
                        onChange={(e) => setSyncConfig({ ...syncConfig, apiKey: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-650 font-mono"
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              )}

              {syncStatus && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  syncStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-650'
                }`}>
                  {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{syncStatus.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-red-600/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synchronizing Database...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Sync reviews from Google</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Manual Add Tab */}
      {activeTab === 'manual' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Create Client Testimonial
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Add a customized, localized moving review directly into your frontend testimonials section.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Author Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. John Miller" 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    City Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Calgary, AB" 
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650 font-bold text-gray-700"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Publish Date
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. May 2026" 
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650"
                  />
                </div>
              </div>

              {/* Avatar Url */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Profile Photo URL (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. https://images.unsplash.com/..." 
                  value={form.avatar_url}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Testimonial Review Content *
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Describe customer's relocation experience..." 
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-650 resize-none"
                />
              </div>

              {formMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  formMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-650'
                }`}>
                  {formMessage.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{formMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-red-600/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Adding Testimonial...' : 'Create Testimonial'}
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
