const express = require('express');
const router = express.Router();

router.post('/create_conversation', async (req, res) => {
  try {
    console.log("📦 Request body:", req.body);
    const { participants, chatOwner } = req.body;

    if (!participants || !chatOwner) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formattedDate = moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A');

    const sanitizedParticipants = participants.map(p => ({
      email: p.email,
      name: p.name,
      dp: p.dp,
      nickname: p.nickname
    }));
    console.log("participants data: sanitizedParticipants" + sanitizedParticipants.toString())

    const newChat = new chatsList({
      participants: sanitizedParticipants,
      chatOwner,
      createdAt: formattedDate,
    });

    const saved = await newChat.save();
    console.log("saved data:"+ saved)
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;