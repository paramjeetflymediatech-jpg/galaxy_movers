import Blog from '@/models/Blog';
import BlogsManager from './BlogsManager';

export default async function AdminBlogsPage() {
  let blogs = [];

  try {
    const list = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });
    blogs = list.map(b => b.toJSON());
  } catch (err) {
    console.error('Error fetching blogs inside AdminBlogsPage server component:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Blog Articles & Guides
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Author, edit, and publish dynamic relocation guides and packing checklists for your website.
        </p>
      </div>

      {/* Blogs Interactive CRUD Container */}
      <BlogsManager initialBlogs={blogs} />

    </div>
  );
}
