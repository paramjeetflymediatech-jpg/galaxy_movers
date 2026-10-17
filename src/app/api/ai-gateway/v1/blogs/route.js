import Blog from '@/models/Blog';
import { authenticateAiGateway, handleOptions, jsonResponse } from '@/lib/ai-gateway-auth';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');
    const status = url.searchParams.get('status');

    if (id) {
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return jsonResponse({ success: false, message: `Blog with ID ${id} not found.` }, { status: 404 });
      }
      return jsonResponse({ success: true, data: blog });
    }

    if (slug) {
      const blog = await Blog.findOne({ where: { slug: slug.trim().toLowerCase() } });
      if (!blog) {
        return jsonResponse({ success: false, message: `Blog with slug '${slug}' not found.` }, { status: 404 });
      }
      return jsonResponse({ success: true, data: blog });
    }

    const where = {};
    if (status && ['draft', 'published'].includes(status)) {
      where.status = status;
    }

    const blogs = await Blog.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return jsonResponse({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error('AI Gateway Blogs GET Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    let { title, slug, excerpt, content, image, author, status, publishedAt, faqs } = body;

    if (!title) {
      return jsonResponse({ success: false, error: 'title is required.' }, { status: 400 });
    }

    const normalizedSlug = slug ? slugify(slug) : slugify(title);

    const formattedFaqs = faqs ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : null;

    const blogStatus = status === 'published' ? 'published' : 'draft';
    const blogPublishedAt = blogStatus === 'published' ? (publishedAt || new Date()) : null;

    const existing = await Blog.findOne({ where: { slug: normalizedSlug } });

    if (existing) {
      await existing.update({
        title,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content !== undefined ? content : existing.content,
        image: image !== undefined ? image : existing.image,
        author: author || existing.author,
        status: status || existing.status,
        publishedAt: status === 'published' ? (blogPublishedAt || existing.publishedAt) : existing.publishedAt,
        faqs: formattedFaqs !== undefined ? formattedFaqs : existing.faqs,
      });

      return jsonResponse({
        success: true,
        message: `Blog '${title}' updated successfully.`,
        data: existing,
      });
    }

    const newBlog = await Blog.create({
      title,
      slug: normalizedSlug,
      excerpt: excerpt || (content ? content.replace(/<[^>]*>?/gm, '').substring(0, 160) : ''),
      content,
      image,
      author: author || 'Galaxy Movers Team',
      status: blogStatus,
      publishedAt: blogPublishedAt,
      faqs: formattedFaqs,
    });

    return jsonResponse(
      {
        success: true,
        message: `Blog '${title}' created successfully.`,
        data: newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('AI Gateway Blogs POST Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const { id, slug } = body;

    let blog = null;
    if (id) {
      blog = await Blog.findByPk(id);
    } else if (slug) {
      blog = await Blog.findOne({ where: { slug: slugify(slug) } });
    }

    if (!blog) {
      return jsonResponse({ success: false, error: 'Blog not found for update.' }, { status: 404 });
    }

    const formattedFaqs = body.faqs !== undefined
      ? (typeof body.faqs === 'string' ? body.faqs : JSON.stringify(body.faqs))
      : blog.faqs;

    await blog.update({
      title: body.title || blog.title,
      slug: body.new_slug ? slugify(body.new_slug) : blog.slug,
      excerpt: body.excerpt !== undefined ? body.excerpt : blog.excerpt,
      content: body.content !== undefined ? body.content : blog.content,
      image: body.image !== undefined ? body.image : blog.image,
      author: body.author || blog.author,
      status: body.status || blog.status,
      publishedAt: body.status === 'published' ? (body.publishedAt || blog.publishedAt || new Date()) : blog.publishedAt,
      faqs: formattedFaqs,
    });

    return jsonResponse({ success: true, message: `Blog updated successfully.`, data: blog });
  } catch (error) {
    console.error('AI Gateway Blogs PUT Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    let blog = null;
    if (id) {
      blog = await Blog.findByPk(id);
    } else if (slug) {
      blog = await Blog.findOne({ where: { slug: slugify(slug) } });
    }

    if (!blog) {
      return jsonResponse({ success: false, error: 'Blog post not found.' }, { status: 404 });
    }

    await blog.destroy();
    return jsonResponse({ success: true, message: `Blog post '${blog.title}' deleted successfully.` });
  } catch (error) {
    console.error('AI Gateway Blogs DELETE Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}
