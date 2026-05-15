const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST: Register a new B2B account
exports.registerUser = async (req, res) => {
    try {
        const { businessName, email, password, role } = req.body;
        
        // 1. Check if the business already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // 2. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save the new user to MongoDB
        const newUser = new User({ 
            businessName, 
            email, 
            password: hashedPassword, 
            role 
        });
        await newUser.save();

        res.status(201).json({ message: 'Business registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// POST: Login to an existing account
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // 2. Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate the JWT Token (Includes user ID and Role)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Send token and basic profile data back to React
        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                businessName: user.businessName, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// GET: Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};