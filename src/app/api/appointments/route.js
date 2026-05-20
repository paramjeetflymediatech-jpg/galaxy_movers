import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { verifyToken } from '@/lib/auth';
import { sendAdminNotificationEmail } from '@/lib/nodemailer';

// Public Appointment Booking Submission
export async function POST(req) {
  try {
    const { 
      fullName, 
      phone, 
      email, 
      appointmentDate, 
      timeSlot, 
      moveSize, 
      movingFrom, 
      movingTo, 
      notes 
    } = await req.json();

    if (!fullName || !phone || !email || !appointmentDate || !timeSlot || !moveSize || !movingFrom || !movingTo) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Insert new appointment into MySQL
    const appointment = await Appointment.create({
      fullName,
      phone,
      email,
      appointmentDate,
      timeSlot,
      moveSize,
      movingFrom,
      movingTo,
      notes,
      status: 'pending'
    });

    // Send email notification to admin asynchronously
    const emailSubject = `New Appointment Booked: ${fullName} on ${appointmentDate}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaebed; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #dc2626; margin-top: 0; font-size: 20px; font-weight: 800;">New Moving Appointment Booking</h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">A customer has scheduled a moving appointment through the Galaxy Movers website.</p>
        
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
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Appointment Date</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${appointmentDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Preferred Time Slot</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 13px; color: #6b7280;">Move Size</td>
            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #111827;">${moveSize}</td>
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
            <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #6b7280; vertical-align: top;">Additional Notes</td>
            <td style="padding: 10px; font-size: 13px; color: #374151; line-height: 1.5; white-space: pre-wrap;">${notes || 'None provided.'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard/appointments" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.15);">
            Manage Appointments in Dashboard
          </a>
        </div>
      </div>
    `;

    sendAdminNotificationEmail(emailSubject, emailHtml).catch(err => {
      console.error('Failed sending admin notification email on Appointment POST:', err);
    });

    return NextResponse.json(
      { message: 'Moving appointment booked successfully.', appointmentId: appointment.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Appointments POST API error:', err);
    return NextResponse.json(
      { message: 'Server error during appointment booking.' },
      { status: 500 }
    );
  }
}

// Admin List Appointments
export async function GET(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const appointments = await Appointment.findAll({
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (err) {
    console.error('Appointments GET API error:', err);
    return NextResponse.json(
      { message: 'Server error during appointments retrieval.' },
      { status: 500 }
    );
  }
}

// Admin Update Appointment Status
export async function PUT(req) {
  try {
    const session = await verifyToken(req);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: 'Appointment ID and status are required.' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found.' },
        { status: 404 }
      );
    }

    await appointment.update({ status });

    return NextResponse.json(
      { message: 'Appointment status updated successfully.', appointment },
      { status: 200 }
    );
  } catch (err) {
    console.error('Appointments PUT API error:', err);
    return NextResponse.json(
      { message: 'Server error during appointment status update.' },
      { status: 500 }
    );
  }
}
