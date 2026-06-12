import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/stats — Admin dashboard stats
export async function GET(request) {
  try {
    const { user, error, status } = requireAdmin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();

    const [totalEvents, totalBookings, totalUsers, upcomingEvents, recentBookings, revenue] = await Promise.all([
      Event.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Event.countDocuments({ status: 'upcoming', date: { $gte: new Date() } }),
      Booking.find({ status: 'confirmed' })
        .populate('userId', 'name email')
        .populate('eventId', 'title date price')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    // Serialize recentBookings
    const serializedBookings = recentBookings.map(b => ({
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

    return NextResponse.json({
      totalEvents,
      totalBookings,
      totalUsers,
      upcomingEvents,
      totalRevenue,
      recentBookings: serializedBookings,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
