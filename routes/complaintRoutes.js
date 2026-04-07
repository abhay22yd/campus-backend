const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint.js');

// --- 1. THE FUNCTIONS (LOGIC) ---

// Get ALL Complaints (Admin View - Populates user info)
const getAll = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Newest first
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Complaints for a SPECIFIC Student (Private View)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a New Complaint (Now includes User ID)
const addOne = async (req, res) => {
  try {
    const { title, category, description, user } = req.body;
    
    const newComplaint = new Complaint({
      title,
      category,
      description,
      user // The User ID from localStorage
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Resolve a Complaint (Admin action)
const resolveById = async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { status: "Resolved" }, 
      { new: true } 
    );
    if (!updated) return res.status(404).json({ message: "ID not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- 2. THE ROUTES (ADDRESSES) ---

// GET Routes
router.get('/', getAll);
router.get('/all', getAll);
router.get('/my-complaints/:userId', getMyComplaints); // <-- NEW ROUTE

// POST Routes
router.post('/', addOne);
router.post('/add', addOne);

// UPDATE Routes
router.patch('/:id', resolveById);
router.put('/:id', resolveById);

// DELETE Route
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "ID not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;