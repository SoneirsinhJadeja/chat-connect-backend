// const mongoose = require('mongoose');

// const mongooseURL = 'mongodb://localhost:27017/chatConnect';

// mongoose.connect(mongooseURL); // No extra options needed now

// const db = mongoose.connection;

// db.on('connected', () => {
//     console.log('Connected to MongoDB Server');
// });
// db.on('error', (err) => {
//     console.log('Error connecting to MongoDB Server:', err);
// });
// db.on('disconnected', () => {
//     console.log('MongoDB Disconnected');
// });

// module.exports = db;
 

const mongoose = require('mongoose');

// Get the MongoDB URI from environment variables (Render or .env)
const mongooseURL = process.env.MONGO_URI;

mongoose.connect(mongooseURL)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

module.exports = mongoose.connection;
