const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    unique: true, // ✅ This enforces the unique constraint
    type: String
  },
  createdAt: {
    type: String,
  },
  lastSeen: {
    type: String,
  },
  dp: {
    required: false,
    type: String
  }
});

// ✅ Model name: user-profile
// ✅ Collection name: user-profile (last argument forces it)
module.exports = mongoose.model("user-profile", userSchema, "user-profile");
