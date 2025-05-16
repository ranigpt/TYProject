const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/verifytoken');
const User = require('../models/Register'); // Ensure this is the correct User model path

const router = express.Router();

// Multer storage setup (Save locally)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile_pictures');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if not exists
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname)); // Save as userId.jpg/png
  },
});

const upload = multer({ storage });

// Update Profile Picture Route
router.put('/upload',authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/profile_pictures/${req.file.filename}`; // Adjust as per frontend

    // Update user's profile picture in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { Dp: filePath },
      { new: true }
    );

    res.json({ message: 'Profile picture updated successfully', Dp: filePath });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
