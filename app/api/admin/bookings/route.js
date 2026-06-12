export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/bookings — All bookings (admin only)
export async function GET(request) {
  try {
    const { user, error, status } = requireAdmin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();

    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title date location price')
      .sort({ createdAt: -1 })
      .lean();

    const serialized = bookings.map(b => ({
      ...b,
      _id:     b._id.toString(),
      userId:  b.userId ? { ...b.userId, _id: b.userId._id.toString() } : null,
      eventId: b.eventId ? {
        ...b.eventId,
        _id:  b.eventId._id.toString(),
        date: b.eventId.date instanceof Date ? b.eventId.date.toISOString() : b.eventId.date,
      } : null,
      bookingDate: b.bookingDate instanceof Date ? b.bookingDate.toISOString() : b.bookingDate,
      createdAt:   b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
    }));

    return NextResponse.json({ bookings: serialized });
  } catch (error) {
    console.error('GET /api/admin/bookings error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
