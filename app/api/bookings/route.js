export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { requireLogin } from '@/lib/auth';

// POST /api/bookings — Create booking (logged-in users only)
export async function POST(request) {
  try {
    const { user, error, status } = requireLogin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    // Admins don't book events
    if (user.role === 'admin') {
      return NextResponse.json({ message: 'Admins cannot book events.' }, { status: 403 });
    }

    await connectToDatabase();
    const { eventId, numberOfTickets } = await request.json();

    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      return NextResponse.json({ message: 'Event ID and number of tickets are required.' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found.' }, { status: 404 });
    }

    // Validate event can be booked
    if (event.status === 'cancelled') {
      return NextResponse.json({ message: 'This event has been cancelled.' }, { status: 400 });
    }
    if (event.status === 'completed') {
      return NextResponse.json({ message: 'This event is already completed.' }, { status: 400 });
    }
    if (new Date(event.date) < new Date()) {
      return NextResponse.json({ message: 'Cannot book a past event.' }, { status: 400 });
    }
    if (event.availableSeats < numberOfTickets) {
      return NextResponse.json({ message: `Only ${event.availableSeats} seats are available.` }, { status: 400 });
    }

    const totalAmount = event.price * numberOfTickets;

    // Create booking
    const booking = await Booking.create({
      userId:          user.id,
      eventId,
      numberOfTickets: Number(numberOfTickets),
      totalAmount,
      status:          'confirmed',
      bookingDate:     new Date(),
    });

    // Reduce available seats
    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -numberOfTickets } });

    return NextResponse.json({ message: 'Booking confirmed!', booking }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
