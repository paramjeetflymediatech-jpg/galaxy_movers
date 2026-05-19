import { NextResponse } from 'next/server';
import Lead from '@/models/Lead';
import { verifyToken } from '@/lib/auth';

// Public Quote Submission
export async function POST(req) {
  try {
    const { fullName, phone, email, movingDate, movingFrom, movingTo, details } = await req.json();

    if (!fullName || !phone || !email || !movingDate || !movingFrom || !movingTo) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Insert new lead into MySQL
    const lead = await Lead.create({
      fullName,
      phone,
      email,
      movingDate,
      movingFrom,
      movingTo,
      details,
      status: 'new'
    });

    return NextResponse.json(
      { message: 'Quote request submitted successfully.', leadId: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Leads POST API error:', err);
    return NextResponse.json(
      { message: 'Server error during quote request processing.' },
      { status: 500 }
    );
  }
}

// Admin List Leads
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (err) {
    console.error('Leads GET API error:', err);
    return NextResponse.json(
      { message: 'Server error during leads retrieval.' },
      { status: 500 }
    );
  }
}
