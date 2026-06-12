import mongoose from 'mongoose';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = mongoUriLine ? mongoUriLine.substring('MONGODB_URI='.length).trim() : null;

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection successful');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const users = db.collection('users');
    const adminUser = await users.findOne({ role: 'admin' });
    console.log('Admin user found:', adminUser ? adminUser.email : 'None');
    
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
testConnection();
