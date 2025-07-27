// 📦 Import dependencies
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const validator = require('validator');
const moment = require('moment-timezone'); // ✅ Only this one — remove duplicate

// 🗃️ Import DB and Mongoose models
const mongoose = require('mongoose');
const db = require('./db.js'); // MongoDB connection
const userProfile = require('./Schemas/userProfileSchema.js'); // User Profile model
const friendRequest = require('./Schemas/friendRequestSchema.js'); // Friend Request model
const chatsList = require('./Schemas/createConversationSchema'); // Chat schema

// 🚀 Initialize Express app
const app = express();

// 📦 Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // or higher, e.g. '20mb'
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Ensure unique indexes (example: unique email in user profile)
userProfile.init().then(() => {
  // console.log('✅ Unique email index ensured');
});

// 🖼️ Multer setup for image uploads (stored in memory)
const upload = multer({ storage: multer.memoryStorage() });

// 🌐 Root endpoint
app.get('/', (req, res) => {
  res.send('📡 Server is running and ready to accept requests!');
});


// ========================
// 👤 Add User Profile
// ========================
app.post('/add_userProfile', upload.single('dp'), async (req, res) => {
  try {
    const { name, email, createdAt, lastSeen } = req.body;

    // 🧠 Basic validation
    if (!name || !email || !createdAt || !lastSeen) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 🖼️ Convert uploaded image to Base64 if exists
    const dp = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : null;

    const newUser = new userProfile({
      name,
      email,
      createdAt,
      lastSeen,
      dp,
    });

    const savedUser = await newUser.save();
    console.log('✅ User profile saved:', savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('❌ Error saving user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========================
// 📥 Fetch All User Profiles (for search & sending requests)
// ========================
app.get('/fetch_userProfile_for_sendReq', async (req, res) => {
  try {
    const data = await userProfile.find();
    // console.log('✅ Fetched user profiles');
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// ========================
// 🤝 Add Friend Request
// ========================
app.post('/add_friendRequest', upload.single('dp'), async (req, res) => {
  try {
    const { from, requestUserName, to } = req.body;

    // ✅ 1. Validate required fields
    if (!from || !to || !requestUserName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validator.isEmail(from) || !validator.isEmail(to)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

     // ✅ 2. Prevent duplicate friend requests in either direction
    const existingRequest = await friendRequest.findOne({
      $or: [
        { from, to },
        { from: to, to: from } // 🔁 reversed direction
      ]
    });

    if (existingRequest) {
      return res.status(409).json({ message: "Friend request already exists in either direction" });
    }

    // ✅ 3. Convert image to base64 if exists
    const photoBase64 = req.file
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : null;

    // ✅ 4. Format date
    const formattedDate = moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A');

    // ✅ 5. Create new request
    // ✅ Corrected: Use requestedUsername instead of requestUserName
    const newRequest = new friendRequest({
    from,
    to,
    requestedUsername: requestUserName,
    dp: photoBase64,
    whenRequested: formattedDate
  });


    const savedRequest = await newRequest.save();
    console.log('✅ Friend request saved:', savedRequest);
    res.status(201).json(savedRequest);
    
  } catch (error) {
    console.error('❌ Error saving friend request:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ========================
// 📥 Fetch users friend frequest
// ========================
// ✅ Only fetch conversations where chatOwner === email
app.get('/fetch_friendRequest', async (req, res) => { 
  const email = req.query.email; // use `email` in lowercase to match frontend

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const requests = await friendRequest.find({ to: email });

    if (!requests || requests.length === 0) {
      return res.status(404).json([]); // ✅ Return empty list instead of null
    }

    res.status(200).json(requests);
  } catch (e) {
    console.error("❌ Error fetching friend requests:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ========================
// 📥 Fetch users friend frequest
// ========================
app.delete('/delete_friendRequest', async (req, res) => {
  const FROM = req.query.FROM;
  const TO = req.query.TO;

  if (!FROM || !TO) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const result = await friendRequest.deleteOne({ to: TO, from: FROM });

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    console.error("❌ Error deleting friend request:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/find_conversation', async (req, res) => {
  const email = req.query.email;
  // console.log("🔍 Checking conversation for email:", email);

  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const convo = await chatsList.findOne({ chatOwner: email });

    if (!convo) return res.status(404).json(null);
    res.status(200).json(convo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/update_participants/:email', async (req, res) => {
  const ownerEmail = req.params.email; // ✅ Get from URL
  const updatedparticipants = req.body.participants; // ✅ Matches frontend key


  if (!Array.isArray(updatedparticipants)) {
    return res.status(400).json({ error: 'Participants must be an array' });
  }

  try {
    const updated = await chatsList.updateOne(
      { chatOwner: ownerEmail }, // ✅ Assuming chatOwner is a field in DB
      { $set: { participants: updatedparticipants } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "Conversation not found or unchanged" });
    }

    res.status(200).json({ message: "✅ Participants updated", updated });
  } catch (e) {
    console.error("❌ Error updating participants:", e.message);
    res.status(500).json({ error: e.message });
  }
});


app.post('/createConversation', async (req, res) => {
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
    console.log("participants data: sanitizedParticipants" + sanitizedParticipants)

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

// 🚀 Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});