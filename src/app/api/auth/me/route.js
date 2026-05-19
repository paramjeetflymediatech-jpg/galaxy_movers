import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await verifyToken(req);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized session.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { email: session.email, role: session.role },
      { status: 200 }
    );
  } catch (err) {
    console.error('Session GET API error:', err);
    return NextResponse.json(
      { message: 'Server error during session retrieval.' },
      { status: 500 }
    );
  }
}
