const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/Register"); // User model
const Post = require("../models/PostData"); // Post model
const Middleware = require('../middleware/verifytoken');

// Route to get user profile and posts by email
router.get("/profile/:email", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.params.email }).select("-Password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ User_Id: user._id }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    console.error("Error fetching user profile and posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/AllDetails",Middleware, async (req, res) => {
  try {
    const user = await User.findOne().select("-Password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    //const posts = await Post.find({ User_Id: user._id }).sort({ createdAt: -1 });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile and posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Route to serve profile pictures
router.get("/profile-picture/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads/profile_pictures/", req.params.filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "Profile picture not found" });
  }
});

module.exports = router;
