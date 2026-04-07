const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 2. Hash the password (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student' // Default to student if not provided
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully! ✅" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verify User Exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 2. Check Password (Compare typed password with hashed DB password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 3. Generate JWT Token (Your "Digital ID Card")
    // Using a secret key from environment variables is best practice
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret_key", 
      { expiresIn: '24h' }
    );

    // 4. Send Response (Omit password from user object for security)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        email: user.email 
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;