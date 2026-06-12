const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection successful');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check users collection for admin
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
