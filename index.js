const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const db = require('./db.js'); // MongoDB connection
const User = require('./userSchema.js'); // ✅ Mongoose model


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Multer configuration for storing images locally
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/\s+/g, '_'); // replaces spaces with _
        cb(null, Date.now() + '_' + cleanName);
    },
});
*/

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Serve images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test endpoint
app.get('/', (req, res) => {
    res.send('📡 Server is running and ready to accept requests!');
});

// API to store user profile
app.post('/add_userProfile', upload.single('DP'), async (req, res) => {
    try {
        const { name, email, createdAt, lastSeen } = req.body;

        // const photoUrl = req.file
        //     ? `http://192.168.1.34:3000/uploads/${req.file.filename}`
        //     : null;

       const photoBase64 = req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        : null;



        const newUser = new User({
            name,
            email,
            createdAt,
            lastSeen,
            // photoUrl
            photoBase64
        });

        const savedUser = await newUser.save();
        console.log('✅ User saved:', savedUser);
        res.status(200).json(savedUser);

    } catch (error) {
        console.error('❌ Error saving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API to Fetch user profile
app.get('/fetch_userProfile_for_sendReq', async (req, res) => {
    try {
        const data = await User.find();
        console.log('✅ User saved:', data);
        res.status(200).json(data);
    } catch (error) {
      
    }
})

app.listen(3000, '0.0.0.0', () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
