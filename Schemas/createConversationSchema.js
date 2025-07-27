const mongoose = require('mongoose');

const chatsSchema = new mongoose.Schema({
  // isGroup: {
  //   type: Boolean,
  //   required: true,
  // },
  participants: {
  type: [
    {
      email: { type: String, required: true },
      name: { type: String },
      dp: { type: String },
      nickname: { type: String }
    }
  ],
  required: true,
},

  chatOwner: {
    type: String,
    required: false, // ✅ Optional, only needed if isGroup is true
  },
  createdAt: {
    type: String,
    required: true, // ✅ Timestamp for sorting chats
  },


});

// ✅ Model name: chats
// ✅ Collection name: chats
module.exports = mongoose.model("chatsList", chatsSchema, "chatsList");
