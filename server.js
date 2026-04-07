const path = require('path');
// 1. Load .env using an absolute path to avoid "undefined" MONGO_URI errors
require('dotenv').config({ path: path.join(__dirname, '.env') }); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Import Routes
const complaintRoutes = require('./routes/complaintRoutes.js');
const authRoutes = require('./routes/authRoutes');

const app = express(); 

// 3. CORS Configuration (Allows any local port like 5173, 5174, 5176, etc.)
app.use(cors({
  origin: true, 
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}));

// 4. Middleware
app.use(express.json()); // Essential for reading req.body in Login/Register

// 5. API Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);

// Test Route to check if Server is alive
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

// 7. Global Error Handler (This shows the REAL error in your terminal)
app.use((err, req, res, next) => {
  console.error("!!! SERVER ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});