import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully.' },
      { status: 200 }
    );

    // Delete session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('Logout API error:', err);
    return NextResponse.json(
      { message: 'Server error during logout.' },
      { status: 500 }
    );
  }
}
