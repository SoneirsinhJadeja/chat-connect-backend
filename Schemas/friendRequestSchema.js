const mongoose = require('mongoose');

const userRequestSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  requestedUsername: {
    type: String,
    required: true,
  },
  dp: {
    type: String,
    required: false,
  },
  whenRequested: {
    type: String,
    required: true,
  },
});

// ✅ Optional: Prevent duplicate friend requests
userRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model("friend-requests", userRequestSchema, "friend-requests");
