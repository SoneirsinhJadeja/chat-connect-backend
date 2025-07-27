const mongoose = require('mongoose'); // 👈 This was missing

const participantSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  dp: { type: String },
  nickname: { type: String }
}, { _id: false });

const chatsSchema = new mongoose.Schema({
  participants: {
    type: [participantSchema],
    required: true,
  },
  chatOwner: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("chatsList", chatsSchema);
