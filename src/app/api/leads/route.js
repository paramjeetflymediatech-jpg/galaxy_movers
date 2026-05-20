import { NextResponse } from 'next/server';
import Lead from '@/models/Lead';
import { verifyToken } from '@/lib/auth';
import { sendAdminNotificationEmail } from '@/lib/nodemailer';

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

    // Send email notification to admin asynchronously
    const emailSubject = `New Moving Quote Request: ${fullName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaebed; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #dc2626; margin-top: 0; font-size: 20px; font-weight: 800;">New Moving Quote Request</h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">A new request has been submitted through the Galaxy Movers website quotes form.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280; width: 35%;">Customer Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Phone Number</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Email Address</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Moving Date</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${movingDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Moving From</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${movingFrom}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Moving To</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${movingTo}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #6b7280; vertical-align: top;">Additional Details</td>
            <td style="padding: 10px; font-size: 13px; color: #374151; line-height: 1.5; white-space: pre-wrap;">${details || 'None provided.'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard/leads" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.15);">
            Manage Leads in Dashboard
          </a>
        </div>
      </div>
    `;

    sendAdminNotificationEmail(emailSubject, emailHtml).catch(err => {
      console.error('Failed sending admin notification email on Lead POST:', err);
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
