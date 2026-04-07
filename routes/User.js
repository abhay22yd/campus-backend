const mongoose = require('mongoose');

// models/User.js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    default: 'student', // If no role is provided, it's a student
    enum: ['student', 'admin'] // Only these two values are allowed
  }
});

module.exports = mongoose.model('User', UserSchema);