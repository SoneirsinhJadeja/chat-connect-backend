const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    createdAt: {
        type: String,
    },  
    lastSeen: {
        type: String,
    },
    photoBase64: {
        required: false, // optional if no photo is uploaded
        type: String
    }
});

module.exports = mongoose.model("user-profile", userSchema, "user-profile");
