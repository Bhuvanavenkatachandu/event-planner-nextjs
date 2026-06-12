import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { requireLogin } from '@/lib/auth';

// DELETE /api/bookings/[id] — Cancel booking (owner only)
export async function DELETE(request, { params }) {
  try {
    const { user, error, status } = requireLogin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    // Only owner can cancel
    if (booking.userId.toString() !== user.id.toString()) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 403 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ message: 'Booking is already cancelled.' }, { status: 400 });
    }

    // Restore available seats
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { availableSeats: booking.numberOfTickets },
    });

    // Mark as cancelled
    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('DELETE /api/bookings/[id] error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
