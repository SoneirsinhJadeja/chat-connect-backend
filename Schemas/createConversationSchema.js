const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  email: String,
  name: String,
  dp: {
    type: String,
    default: null
  },
  nickname: String
});

const conversationSchema = new mongoose.Schema({
  chatOwner: {
    type: String,
    required: true
  },
  participants: [participantSchema],
  createdAt: String
});

module.exports = mongoose.model('chatsList', conversationSchema);
