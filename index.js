// 📦 Import dependencies
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const validator = require('validator');

// 🗃️ Import DB and Mongoose models
const db = require('./db.js'); // MongoDB connection
const userProfile = require('./Schemas/userProfileSchema.js'); // User Profile model
const friendRequest = require('./Schemas/friendRequestSchema.js'); // Friend Request model

// 🚀 Initialize Express app
const app = express();

// 📦 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure unique indexes (example: unique email in user profile)
userProfile.init().then(() => {
  console.log('✅ Unique email index ensured');
});

// 🖼️ Multer setup for image uploads (stored in memory)
const upload = multer({ storage: multer.memoryStorage() });

// 🌐 Root endpoint
app.get('/', (req, res) => {
  res.send('📡 Server is running and ready to accept requests!');
});
// 🌐 Root endpoint
app.get('/add_userProfile', (req, res) => {
  res.send('📡 Server is running and ready to accept requests!');
});

// 🌐 Root endpoint
app.get('/add_friendRequest', (req, res) => {
  res.send('📡 Server is running and ready to accept requests!');
});

// 🌐 Root endpoint
app.get('/fetch_userProfile_for_sendReq', (req, res) => {
  res.send('📡 Server is running and ready to accept requests!');
});


// ========================
// 👤 Add User Profile
// ========================
app.post('/add_userProfile', upload.single('DP'), async (req, res) => {
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
    const photoBase64 = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : null;

    const newUser = new userProfile({
      name,
      email,
      createdAt,
      lastSeen,
      photoBase64,
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
// 🤝 Add Friend Request
// ========================
app.post('/add_friendRequest', upload.single('DP'), async (req, res) => {
  try {
    const { from, requestUserName, to } = req.body;

    // 🧠 Required fields validation
    if (!from || !to || !requestUserName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validator.isEmail(from) || !validator.isEmail(to)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 🔁 Prevent duplicate friend requests
    const existingRequest = await friendRequest.findOne({ from, to });
    if (existingRequest) {
      return res.status(409).json({ message: "Friend request already sent" });
    }

    const photoBase64 = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : null;

    const newRequest = new friendRequest({
      from,
      to,
      requestedUsername: requestUserName,
      photoBase64,
      status: "pending", // Default status
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
// 📥 Fetch All User Profiles (for search & sending requests)
// ========================
app.get('/fetch_userProfile_for_sendReq', async (req, res) => {
  try {
    const data = await userProfile.find();
    console.log('✅ Fetched user profiles');
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// 🚀 Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});