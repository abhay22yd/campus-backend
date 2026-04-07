const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Only need this once

// 2. Import Routes
const complaintRoutes = require('./routes/complaintRoutes.js');
const authRoutes = require('./routes/authRoutes');

const app = express(); 

// 3. UPDATED CORS Configuration
// In your backend server.js
const cors = require('cors');

// Replace your current app.use(cors(...)) with this:
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 4. Middleware
app.use(express.json()); 

// 5. API Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);

// Test Route
app.get('/test', (req, res) => res.json({ message: "Backend is online! ✅" }));

// 6. Database Connection
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ ERROR: MONGO_URI is missing in .env file!");
} else {
  mongoose.connect(uri)
    .then(() => console.log("SUCCESS: Connected to the Database! 🚀"))
    .catch((err) => console.log("FAILED: Database connection error! ❌", err));
}

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error("!!! SERVER ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 8. Start Server (Render uses process.env.PORT automatically)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});