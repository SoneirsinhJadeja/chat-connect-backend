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
