import { NextResponse } from 'next/server';
import Seo from '@/models/Seo';
import { verifyToken } from '@/lib/auth';

// Fetch SEO Metadata Records
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pathName = searchParams.get('path');

    if (pathName) {
      const record = await Seo.findOne({ where: { page_path: pathName } });
      if (!record) {
        return NextResponse.json({ message: 'SEO record not found for this path.' }, { status: 404 });
      }
      return NextResponse.json(record, { status: 200 });
    }

    // Default: Fetch all SEO records
    const records = await Seo.findAll({
      order: [['page_path', 'ASC']]
    });
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error('SEO GET API error:', err);
    return NextResponse.json(
      { message: 'Server error during SEO retrieval.' },
      { status: 500 }
    );
  }
}

// Create new SEO Path Config
export async function POST(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { page_path, title, description, keywords, og_image, header_scripts, footer_scripts, canonical_url, og_title, og_description } = await req.json();

    if (!page_path) {
      return NextResponse.json({ message: 'Page path is a required field.' }, { status: 400 });
    }

    // Check if path already has SEO configured
    const existing = await Seo.findOne({ where: { page_path } });
    if (existing) {
      return NextResponse.json(
        { message: 'SEO configurations already exist for this path. Use edit instead.' },
        { status: 409 }
      );
    }

    const record = await Seo.create({
      page_path: page_path.trim(),
      title,
      description,
      keywords,
      og_image,
      header_scripts,
      footer_scripts,
      canonical_url,
      og_title,
      og_description
    });

    return NextResponse.json({ message: 'SEO configuration saved successfully.', record }, { status: 201 });
  } catch (err) {
    console.error('SEO POST API error:', err);
    return NextResponse.json(
      { message: 'Server error during SEO configuration save.' },
      { status: 500 }
    );
  }
}

// Edit existing SEO Path Config
export async function PUT(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { id, page_path, title, description, keywords, og_image, header_scripts, footer_scripts, canonical_url, og_title, og_description } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'SEO Record ID is required for editing.' }, { status: 400 });
    }

    const record = await Seo.findByPk(id);
    if (!record) {
      return NextResponse.json({ message: 'SEO configuration record not found.' }, { status: 404 });
    }

    // Block path renaming to avoid routing errors
    if (page_path && page_path !== record.page_path) {
      const existing = await Seo.findOne({ where: { page_path } });
      if (existing) {
        return NextResponse.json({ message: 'This page path is already configured.' }, { status: 409 });
      }
    }

    await record.update({
      page_path: page_path ? page_path.trim() : record.page_path,
      title: title !== undefined ? title : record.title,
      description: description !== undefined ? description : record.description,
      keywords: keywords !== undefined ? keywords : record.keywords,
      og_image: og_image !== undefined ? og_image : record.og_image,
      header_scripts: header_scripts !== undefined ? header_scripts : record.header_scripts,
      footer_scripts: footer_scripts !== undefined ? footer_scripts : record.footer_scripts,
      canonical_url: canonical_url !== undefined ? canonical_url : record.canonical_url,
      og_title: og_title !== undefined ? og_title : record.og_title,
      og_description: og_description !== undefined ? og_description : record.og_description
    });

    return NextResponse.json({ message: 'SEO configuration updated successfully.', record }, { status: 200 });
  } catch (err) {
    console.error('SEO PUT API error:', err);
    return NextResponse.json(
      { message: 'Server error during SEO update.' },
      { status: 500 }
    );
  }
}

// Delete SEO Config
export async function DELETE(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'SEO Record ID is required for deletion.' }, { status: 400 });
    }

    const record = await Seo.findByPk(id);
    if (!record) {
      return NextResponse.json({ message: 'SEO record not found.' }, { status: 404 });
    }

    // Do not allow deleting root (/) metadata to keep defaults safe
    if (record.page_path === '/') {
      return NextResponse.json({ message: 'Root page (/) SEO metadata cannot be deleted.' }, { status: 403 });
    }

    await record.destroy();
    return NextResponse.json({ message: 'SEO configuration deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('SEO DELETE API error:', err);
    return NextResponse.json(
      { message: 'Server error during SEO config deletion.' },
      { status: 500 }
    );
  }
}
