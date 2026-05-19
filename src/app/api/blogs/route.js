import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

// Fetch Blogs (Public & Admin)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (id) {
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
      }
      return NextResponse.json(blog, { status: 200 });
    }

    if (slug) {
      const blog = await Blog.findOne({ where: { slug } });
      if (!blog) {
        return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
      }
      return NextResponse.json(blog, { status: 200 });
    }

    // Default: Fetch all blogs (ordered by newest)
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(blogs, { status: 200 });
  } catch (err) {
    console.error('Blogs GET API error:', err);
    return NextResponse.json(
      { message: 'Server error during blogs retrieval.' },
      { status: 500 }
    );
  }
}

// Create Blog (Admin Only)
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { title, slug, excerpt, content, image, author, status, publishedAt, faqs } = await req.json();

    if (!title || !slug) {
      return NextResponse.json(
        { message: 'Title and URL Slug are required fields.' },
        { status: 400 }
      );
    }

    // Check if slug is already used
    const existing = await Blog.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { message: 'This URL Slug is already in use. Please modify it.' },
        { status: 409 }
      );
    }

    const blog = await Blog.create({
      title,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      excerpt,
      content,
      image,
      author: author || 'Admin',
      status: status || 'draft',
      publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
      faqs: faqs ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : null
    });

    return NextResponse.json({ message: 'Blog post created successfully.', blog }, { status: 201 });
  } catch (err) {
    console.error('Blogs POST API error:', err);
    return NextResponse.json(
      { message: 'Server error during blog post creation.' },
      { status: 500 }
    );
  }
}

// Update Blog (Admin Only)
export async function PUT(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { id, title, slug, excerpt, content, image, author, status, publishedAt, faqs } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Blog ID is required for editing.' }, { status: 400 });
    }

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
    }

    // If slug is changing, make sure it is not in use elsewhere
    if (slug && slug !== blog.slug) {
      const existing = await Blog.findOne({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { message: 'This URL Slug is already in use.' },
          { status: 409 }
        );
      }
    }

    await blog.update({
      title: title || blog.title,
      slug: slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : blog.slug,
      excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
      content: content !== undefined ? content : blog.content,
      image: image !== undefined ? image : blog.image,
      author: author || blog.author,
      status: status || blog.status,
      publishedAt: status === 'published' ? (publishedAt || blog.publishedAt || new Date()) : null,
      faqs: faqs !== undefined ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : blog.faqs
    });

    return NextResponse.json({ message: 'Blog post updated successfully.', blog }, { status: 200 });
  } catch (err) {
    console.error('Blogs PUT API error:', err);
    return NextResponse.json(
      { message: 'Server error during blog update.' },
      { status: 500 }
    );
  }
}

// Delete Blog (Admin Only)
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Blog ID is required for deletion.' }, { status: 400 });
    }

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
    }

    await blog.destroy();
    return NextResponse.json({ message: 'Blog post deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Blogs DELETE API error:', err);
    return NextResponse.json(
      { message: 'Server error during blog deletion.' },
      { status: 500 }
    );
  }
}
