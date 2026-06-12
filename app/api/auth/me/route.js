export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = getUserFromToken(request);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
