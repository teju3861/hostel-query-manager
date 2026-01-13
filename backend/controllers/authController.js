const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    // 1. Destructure new fields (email, phone)
    const { username, password, fullName, role, email, phone } = req.body;

    try {
        // --- VALIDATION START ---

        // 2. Validate Email Format (Must contain @ and .)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // 3. Validate Phone Format (Must be exactly 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }

        // --- VALIDATION END ---

        // 4. Check if Username OR Email already exists
        const userExists = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create User with new fields
        const user = await User.create({
            username,
            password: hashedPassword,
            fullName,
            role,
            email, // Saved to DB
            phone, // Saved to DB
            approved: role === 'student' ? false : true // Staff/Admin auto-approved
        });

        res.status(201).json({ message: 'User registered. Pending approval if student.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.approved) return res.status(401).json({ message: 'Account not yet approved by Warden' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};