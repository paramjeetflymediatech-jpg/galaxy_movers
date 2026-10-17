import Seo from '@/models/Seo';
import { authenticateAiGateway, handleOptions, jsonResponse } from '@/lib/ai-gateway-auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || url.searchParams.get('page_path');

    if (path) {
      const record = await Seo.findOne({ where: { page_path: path.trim() } });
      if (!record) {
        return jsonResponse(
          { success: false, message: `No SEO record found for path: '${path}'` },
          { status: 404 }
        );
      }
      return jsonResponse({ success: true, data: record });
    }

    const records = await Seo.findAll({
      order: [['page_path', 'ASC']],
    });

    return jsonResponse({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error('AI Gateway SEO GET Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const page_path = (body.page_path || body.pagePath || body.path || '').trim();

    if (!page_path) {
      return jsonResponse(
        { success: false, error: 'page_path is required (e.g. / or /alberta/calgary).' },
        { status: 400 }
      );
    }

    const payload = {
      page_path,
      title: body.title !== undefined ? body.title : body.meta_title,
      description: body.description !== undefined ? body.description : body.meta_description,
      keywords: body.keywords,
      og_image: body.og_image || body.ogImage,
      header_scripts: body.header_scripts || body.headerScripts,
      footer_scripts: body.footer_scripts || body.footerScripts,
      canonical_url: body.canonical_url || body.canonicalUrl,
      og_title: body.og_title || body.ogTitle,
      og_description: body.og_description || body.ogDescription,
    };

    const existing = await Seo.findOne({ where: { page_path } });

    if (existing) {
      await existing.update(payload);
      return jsonResponse({
        success: true,
        message: `SEO settings updated successfully for '${page_path}'.`,
        data: existing,
      });
    }

    const newRecord = await Seo.create(payload);
    return jsonResponse(
      {
        success: true,
        message: `SEO settings created successfully for '${page_path}'.`,
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('AI Gateway SEO POST Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = authenticateAiGateway(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || url.searchParams.get('page_path');
    const id = url.searchParams.get('id');

    let record = null;
    if (id) {
      record = await Seo.findByPk(id);
    } else if (path) {
      record = await Seo.findOne({ where: { page_path: path.trim() } });
    }

    if (!record) {
      return jsonResponse({ success: false, error: 'SEO record not found.' }, { status: 404 });
    }

    if (record.page_path === '/') {
      return jsonResponse({ success: false, error: 'Root page (/) SEO cannot be deleted.' }, { status: 403 });
    }

    await record.destroy();
    return jsonResponse({ success: true, message: `SEO metadata for '${record.page_path}' deleted successfully.` });
  } catch (error) {
    console.error('AI Gateway SEO DELETE Error:', error);
    return jsonResponse({ success: false, error: error.message }, { status: 500 });
  }
}
