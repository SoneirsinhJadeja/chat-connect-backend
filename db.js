const mongoose = require('mongoose');

const mongooseURL = 'mongodb://localhost:27017/chatConnect';

mongoose.connect(mongooseURL); // No extra options needed now

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB Server');
});
db.on('error', (err) => {
    console.log('Error connecting to MongoDB Server:', err);
});
db.on('disconnected', () => {
    console.log('MongoDB Disconnected');
});

module.exports = db;
 