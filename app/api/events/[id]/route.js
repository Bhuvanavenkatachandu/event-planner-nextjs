import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

// GET /api/events/[id] — Public
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json({ message: 'Event not found.' }, { status: 404 });
    }

    const serialized = {
      ...event,
      _id:       event._id.toString(),
      createdBy: event.createdBy?.toString() || '',
      date:      event.date instanceof Date ? event.date.toISOString() : event.date,
      createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
      updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
    };

    return NextResponse.json({ event: serialized });
  } catch (error) {
    console.error('GET /api/events/[id] error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// PUT /api/events/[id] — Admin only
export async function PUT(request, { params }) {
  try {
    const { user, error, status } = requireAdmin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found.' }, { status: 404 });
    }

    // Calculate seat adjustment if totalSeats changed
    if (body.totalSeats && Number(body.totalSeats) !== event.totalSeats) {
      const seatDiff = Number(body.totalSeats) - event.totalSeats;
      body.availableSeats = Math.max(0, event.availableSeats + seatDiff);
    }

    const updated = await Event.findByIdAndUpdate(id, { ...body, date: body.date ? new Date(body.date) : event.date }, { new: true, runValidators: true });

    return NextResponse.json({ message: 'Event updated successfully!', event: updated });
  } catch (error) {
    console.error('PUT /api/events/[id] error:', error);
    return NextResponse.json({ message: error.message || 'Server error.' }, { status: 500 });
  }
}

// DELETE /api/events/[id] — Admin only
export async function DELETE(request, { params }) {
  try {
    const { user, error, status } = requireAdmin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();
    const { id } = await params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found.' }, { status: 404 });
    }

    // Also cancel related bookings
    await Booking.updateMany({ eventId: id }, { status: 'cancelled' });
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
