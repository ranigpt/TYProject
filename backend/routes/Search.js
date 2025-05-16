const express = require("express");
const router = express.Router();
const Post = require("../models/PostData");
const User = require("../models/Register");

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Find posts based on description or media
    const posts = await Post.find({
      $or: [
        { PostDescription: { $regex: query, $options: "i" } },
        { Media: { $regex: query, $options: "i" } },
      ],
    }).populate("User_Id", "Name Dp Email"); // Populate user details (Name, DP)

    // Find users matching the query
    const users = await User.find({
      Name: { $regex: query, $options: "i" },
    }).select("Name Dp Email"); // Select only relevant fields

    // Get posts made by matched users
    const userPosts = await Post.find({
      User_Id: { $in: users.map((user) => user._id) },
    }).populate("User_Id", "Name Dp Email");

    // Combine both results
    const combinedResults = [...posts, ...userPosts];

    res.status(200).json(combinedResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
