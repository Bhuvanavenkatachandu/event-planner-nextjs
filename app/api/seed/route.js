import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import bcrypt from 'bcryptjs';

// GET /api/seed — Seed database with sample data
export async function GET() {
  try {
    await connectToDatabase();

    // --- Create Admin User ---
    let adminUser = await User.findOne({ email: 'admin@eventify.com' });
    if (!adminUser) {
      const hashedPw = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@eventify.com',
        password: hashedPw,
        role: 'admin',
      });
    }

    // --- Create Sample Events ---
    const existingCount = await Event.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Database already seeded.',
        admin: { email: 'admin@eventify.com', password: 'admin123' },
      });
    }

    const sampleEvents = [
      {
        title: 'Future Tech Summit 2026',
        description: 'Join the most innovative minds at the Future Tech Summit. Experience cutting-edge technology demonstrations, keynote speeches from industry leaders, and networking opportunities with top professionals.',
        category: 'Technology',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '09:00 AM',
        location: 'Hyderabad International Convention Centre',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        organizerName: 'TechWorld India',
        totalSeats: 500,
        availableSeats: 500,
        price: 1500,
        status: 'upcoming',
        featured: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Neon Music Festival',
        description: 'A dazzling night of live music performances featuring top artists and DJs. Experience futuristic light shows, incredible sound systems, and unforgettable memories under the stars.',
        category: 'Music',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '06:00 PM',
        location: 'HITEX Exhibition Centre, Hyderabad',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
        organizerName: 'Neon Events Co.',
        totalSeats: 2000,
        availableSeats: 2000,
        price: 800,
        status: 'upcoming',
        featured: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Global Business Conference',
        description: 'Connect with 500+ entrepreneurs and business leaders. Learn strategies for scaling startups, investment opportunities, and the future of global commerce.',
        category: 'Business',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'The Westin Hyderabad Mindspace',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=800',
        organizerName: 'BizGrow India',
        totalSeats: 300,
        availableSeats: 300,
        price: 2500,
        status: 'upcoming',
        featured: false,
        createdBy: adminUser._id,
      },
      {
        title: 'Full-Stack Dev Bootcamp',
        description: 'Intensive 2-day workshop covering React, Next.js, Node.js, and MongoDB. Build real-world projects and get mentored by senior developers with 10+ years of experience.',
        category: 'Workshop',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '09:30 AM',
        location: 'T-Hub, Hyderabad',
        image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=800',
        organizerName: 'DevSkills Academy',
        totalSeats: 60,
        availableSeats: 60,
        price: 3000,
        status: 'upcoming',
        featured: true,
        createdBy: adminUser._id,
      },
      {
        title: 'AI & Machine Learning Expo',
        description: 'Explore the latest breakthroughs in Artificial Intelligence and Machine Learning. Interactive demos, research paper presentations, and workshops on LLMs, computer vision, and more.',
        category: 'Technology',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Novotel Hyderabad Convention Centre',
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800',
        organizerName: 'AI India Foundation',
        totalSeats: 800,
        availableSeats: 800,
        price: 1200,
        status: 'upcoming',
        featured: false,
        createdBy: adminUser._id,
      },
      {
        title: 'Startup Founders Meetup',
        description: 'An informal gathering for startup founders to share experiences, challenges, and insights. Open mic sessions, investor pitches, and after-party networking.',
        category: 'Meetup',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '06:30 PM',
        location: 'WeWork Jubilee Hills, Hyderabad',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
        organizerName: 'Startup Hyderabad',
        totalSeats: 150,
        availableSeats: 150,
        price: 0,
        status: 'upcoming',
        featured: false,
        createdBy: adminUser._id,
      },
      {
        title: 'Food & Culture Festival',
        description: 'Celebrate diverse culinary traditions at our annual Food & Culture Festival. Over 80 food stalls, live cooking demonstrations, cultural performances, and art installations.',
        category: 'Food',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        time: '11:00 AM',
        location: 'Necklace Road, Hyderabad',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        organizerName: 'Hyderabad Heritage Trust',
        totalSeats: 5000,
        availableSeats: 5000,
        price: 200,
        status: 'upcoming',
        featured: false,
        createdBy: adminUser._id,
      },
      {
        title: 'Design Thinking Workshop',
        description: 'Learn human-centered design methodologies used by top companies. Master prototyping, user research, ideation, and design thinking frameworks in this hands-on workshop.',
        category: 'Education',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        time: '09:00 AM',
        location: 'IIIT Hyderabad Campus',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
        organizerName: 'Design Lab India',
        totalSeats: 40,
        availableSeats: 40,
        price: 1800,
        status: 'upcoming',
        featured: false,
        createdBy: adminUser._id,
      },
    ];

    await Event.insertMany(sampleEvents);

    return NextResponse.json({
      message: `Database seeded with ${sampleEvents.length} events!`,
      admin: { email: 'admin@eventify.com', password: 'admin123' },
      info: 'Use the admin credentials to login and manage events.',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: 'Seed error: ' + error.message }, { status: 500 });
  }
}
