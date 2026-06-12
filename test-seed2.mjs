import mongoose from 'mongoose';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = mongoUriLine ? mongoUriLine.substring('MONGODB_URI='.length).trim() : null;

async function clearAndSeed() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  const db = mongoose.connection.db;
  await db.collection('events').deleteMany({});
  process.exit(0);
}
clearAndSeed();
