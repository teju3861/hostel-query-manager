const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    // --- NEW FIELDS ---
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    // ------------------
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'warden', 'staff'], default: 'student' },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);