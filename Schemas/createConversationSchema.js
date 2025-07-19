const mongoose = require('mongoose');

const chatsSchema = new mongoose.Schema({
  // isGroup: {
  //   type: Boolean,
  //   required: true,
  // },
  participants: {
    type: [String], // ✅ Correct way to declare string array
    required: true,
  },
  chatOwner: {
    type: String,
    required: false, // ✅ Optional, only needed if isGroup is true
  },
  createdAt: {
    type: String,
    required: true, // ✅ Timestamp for sorting chats
    default: () => moment().format('DD-MM-YYYY hh:mm A')
  },
  DP: {
    type: String, // ✅ Optional group or 1-1 chat image
    default: null
  }

});

// ✅ Model name: chats
// ✅ Collection name: chats
module.exports = mongoose.model("chats", chatsSchema, "chats");
