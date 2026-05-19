'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Edit2, Trash2, Calendar, FileText, X, Check, ArrowRight, Loader2, ListPlus } from 'lucide-react';

// Dynamically import rich text editor to prevent Next.js SSR build errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function BlogsManager({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [blogId, setBlogId] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [status, setStatus] = useState('draft');
  const [faqs, setFaqs] = useState([]); // [{ q: '', a: '' }]

  // FAQ input helpers
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  // Auto slugify helper
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!blogId) {
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
    setBlogId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setImage('');
    setAuthor('Admin');
    setStatus('draft');
    setFaqs([]);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleOpenEdit = (blog) => {
    setBlogId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt || '');
    setContent(blog.content || '');
    setImage(blog.image || '');
    setAuthor(blog.author || 'Admin');
    setStatus(blog.status || 'draft');
    
    let parsedFaqs = [];
    if (blog.faqs) {
      try {
        parsedFaqs = JSON.parse(blog.faqs);
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

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: blogId,
      title,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      excerpt,
      content,
      image,
      author,
      status,
      faqs: JSON.stringify(faqs)
    };

    try {
      const method = blogId ? 'PUT' : 'POST';
      const res = await fetch('/api/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save blog post.');
      }

      // Update state local list
      if (blogId) {
        setBlogs(blogs.map((b) => (b.id === blogId ? data.blog : b)));
      } else {
        setBlogs([data.blog, ...blogs]);
      }

      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (confirm('Are you absolutely sure you want to delete this blog post? This action is permanent.')) {
      try {
        const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBlogs(blogs.filter((b) => b.id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete blog.');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header bar */}
      {!isEditing && (
        <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-500">
            {blogs.length} Articles Loaded
          </span>
          <button
            onClick={handleOpenCreate}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 mr-1.5" />
            <span>Create Article</span>
          </button>
        </div>
      )}

      {isEditing ? (
        // EDIT / CREATE FORM OVERLAY
        <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="font-extrabold text-lg text-gray-900">
              {blogId ? 'Edit Article Details' : 'Compose New Article'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              type="button"
              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveBlog} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 10 Relocation Secrets"
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
                  placeholder="e.g. 10-relocation-secrets"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>

            {/* Author, Image & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Admin"
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Short Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief, engaging 2-sentence summary to entice readers..."
                rows="2"
                className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold resize-none text-gray-800"
              ></textarea>
            </div>

            {/* Rich Text Editor */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Article Body Content
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

            {/* Dynamic Blog FAQs array builder */}
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <span className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                <ListPlus className="h-4 w-4 text-red-500" />
                <span>Article FAQs Schema Builder</span>
              </span>

              {/* Input row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Question (e.g. Can you pack fragile electronics?)"
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
                    <span>Save Post</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      ) : (
        // BLOGS GRID LISTING
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white border border-gray-150 rounded-2xl">
              <p className="text-gray-400 text-sm font-semibold">No articles created yet. Write a new post!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="aspect-[16/10] bg-gray-100 relative">
                    <img 
                      src={blog.image || 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800'} 
                      alt={blog.title}
                      className="object-cover w-full h-full"
                    />
                    <span className={`absolute top-3.5 right-3.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${
                      blog.status === 'published'
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : 'bg-amber-50 border-amber-200 text-amber-600'
                    }`}>
                      {blog.status}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                      <Calendar className="h-3.5 w-3.5 text-red-500" />
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 font-semibold tracking-wide truncate">
                      Slug: <span className="text-gray-500">/blog/{blog.slug}</span>
                    </p>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="p-5 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    type="button"
                    className="flex-grow bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-red-600" />
                    <span>Edit Post</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    type="button"
                    className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
                    aria-label="Delete post"
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
