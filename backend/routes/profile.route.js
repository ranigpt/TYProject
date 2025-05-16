const express = require('express');
const router = express.Router();
const User = require('../models/Register');
const Authetication = require('../middleware/verifytoken');
const profileController = require('../controller/profile');
const multer = require('multer');

// Multer Configuration for Profile Picture Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/create', Authetication, profileController);

router.put('/update', Authetication, async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-Password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/upload-image', Authetication, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const userId = req.user._id;
    const imagePath = `/uploads/${req.file.filename}`;
    
    await User.findByIdAndUpdate(userId, { Dp: imagePath });
    console.log("Image stored:", imagePath);

    res.status(200).json({ message: "Image updated", Dp: imagePath });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ message: "Failed to update image." });
  }
});



module.exports = router;
