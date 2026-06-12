export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { requireAdmin } from '@/lib/auth';

// GET /api/events — Public (with search, filter, sort)
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search   = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status   = searchParams.get('status') || '';
    const sort     = searchParams.get('sort') || 'latest';
    const featured = searchParams.get('featured') || '';
    const free     = searchParams.get('free') || '';
    const limit    = parseInt(searchParams.get('limit')) || 0;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { organizerName: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (status)   query.status   = status;
    if (featured === 'true') query.featured = true;
    if (free === 'true')     query.price = 0;

    // Sort
    let sortOption = {};
    switch (sort) {
      case 'date-asc':   sortOption = { date: 1 };       break;
      case 'date-desc':  sortOption = { date: -1 };      break;
      case 'price-asc':  sortOption = { price: 1 };      break;
      case 'price-desc': sortOption = { price: -1 };     break;
      default:           sortOption = { createdAt: -1 }; break; // latest
    }

    let eventsQuery = Event.find(query).sort(sortOption);
    if (limit > 0) eventsQuery = eventsQuery.limit(limit);

    const events = await eventsQuery.lean();

    // Serialize
    const serialized = events.map(e => ({
      ...e,
      _id:       e._id.toString(),
      createdBy: e.createdBy?.toString() || '',
      date:      e.date instanceof Date ? e.date.toISOString() : e.date,
      createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
      updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
    }));

    return NextResponse.json({ events: serialized, total: serialized.length });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// POST /api/events — Admin only
export async function POST(request) {
  try {
    const { user, error, status } = requireAdmin(request);
    if (error) return NextResponse.json({ message: error }, { status });

    await connectToDatabase();
    const body = await request.json();

    const { title, description, category, date, time, location, image,
            organizerName, totalSeats, price, featured, status: evStatus } = body;

    if (!title || !description || !category || !date || !time || !location || !organizerName || !totalSeats) {
      return NextResponse.json({ message: 'Please fill all required fields.' }, { status: 400 });
    }

    if (Number(totalSeats) < 1) {
      return NextResponse.json({ message: 'Total seats must be at least 1.' }, { status: 400 });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date: new Date(date),
      time,
      location,
      image: image || undefined,
      organizerName,
      totalSeats:     Number(totalSeats),
      availableSeats: Number(totalSeats), // initially all seats available
      price:          Number(price) || 0,
      featured:       featured || false,
      status:         evStatus || 'upcoming',
      createdBy:      user.id,
    });

    return NextResponse.json({ message: 'Event created successfully!', event }, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json({ message: error.message || 'Server error.' }, { status: 500 });
  }
}
