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
  status: {
    type: String,
    default: "pending", // ✅ Default status
  },
  photoBase64: {
    type: String,
    required: false,
  },
  whenRequested: {
    type: Date, // ✅ Store as proper Date instead of string
    default: Date.now,
  },
}, {
  timestamps: true // ✅ Automatically add createdAt and updatedAt
});

// ✅ Optional: Prevent duplicate friend requests
userRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model("friend-requests", userRequestSchema, "friend-requests");
