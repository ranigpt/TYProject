
const express = require('express');
const app = express();
const router = express.Router();
const AuthenticateToken = require("../middleware/verifytoken")

const Post = require('../models/PostData');  // Assuming you have a Post model
const User = require('../models/Register');  // Assuming you have a User model

router.get("/postDisplay", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id; // assuming userId is passed with JWT token

  try {
    // Fetch posts and prioritize the user's posts first, then others by createdAt
    const posts = await Post.find()
      .populate("User_Id", "Name Dp")
      .sort({ 
        // Prioritize posts from the logged-in user
        User_Id: userId === undefined ? 1 : -1, 
        createdAt: -1 // Sort by most recent posts
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      console.log("Populated posts on refresh:", posts); // Ensure data is populated every time

      console.log("Fetched posts populated:", posts); // Log to confirm population

    res.status(200).json({ data: posts });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching posts", error: err.message });
  }
});


module.exports = router;