export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import { requireLogin } from '@/lib/auth';

// GET /api/bookings/my-bookings — Get logged-in user's bookings
export async function GET(request) {
  try {
    const { user, error, status } = requireLogin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();

    const bookings = await Booking.find({ userId: user.id })
      .populate('eventId', 'title date time location image category price status')
      .sort({ createdAt: -1 })
      .lean();

    const serialized = bookings.map(b => ({
      ...b,
      _id:         b._id.toString(),
      userId:      b.userId.toString(),
      eventId:     b.eventId ? {
        ...b.eventId,
        _id:  b.eventId._id.toString(),
        date: b.eventId.date instanceof Date ? b.eventId.date.toISOString() : b.eventId.date,
      } : null,
      bookingDate: b.bookingDate instanceof Date ? b.bookingDate.toISOString() : b.bookingDate,
      createdAt:   b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
      updatedAt:   b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
    }));

    return NextResponse.json({ bookings: serialized });
  } catch (error) {
    console.error('GET /api/bookings/my-bookings error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
