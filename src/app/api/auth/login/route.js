import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find admin user in MySQL
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Sign session token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Setup HTTP-only session cookie
    const response = NextResponse.json(
      { message: 'Login successful.', role: user.role },
      { status: 200 }
    );

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json(
      { message: 'Server error during login.' },
      { status: 500 }
    );
  }
}
