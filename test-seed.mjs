import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = mongoUriLine ? mongoUriLine.substring('MONGODB_URI='.length).trim() : null;

// Mock models since we don't have Next.js environment loaded here
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const EventSchema = new mongoose.Schema({
  title: String, description: String, category: String,
  date: Date, time: String, location: String, image: String,
  organizerName: String, totalSeats: Number, availableSeats: Number,
  price: Number, status: String, featured: Boolean, createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected.');
    
    let adminUser = await User.findOne({ email: 'admin@eventify.com' });
    if (!adminUser) {
      const hashedPw = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@eventify.com',
        password: hashedPw,
        role: 'admin',
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
    
    const existingCount = await Event.countDocuments();
    if (existingCount === 0) {
      const sampleEvents = [
        {
          title: 'Future Tech Summit 2026',
          description: 'Join the most innovative minds at the Future Tech Summit.',
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
        }
      ];
      await Event.insertMany(sampleEvents);
      console.log('Sample event created.');
    } else {
      console.log('Events already exist.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
