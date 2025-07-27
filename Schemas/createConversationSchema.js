const participantSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  dp: { type: String },
  nickname: { type: String }
}, { _id: false }); // ✅ Prevent auto _id for subdocs if not needed

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
