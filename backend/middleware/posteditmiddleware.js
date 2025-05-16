const jwt = require("jsonwebtoken");
const User = require("../models/Register");
const Post = require("../models/PostData");

// Middleware to authenticate token and get the user data
const authenticateTokenEdit = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  console.log("backend Token recieved: " + token);

  try {
    const decoded = jwt.verify(token, process.env.COMPANY_SECRET);

    // Check if the user exists in the database
    const user = await User.findById(decoded.id).select("-Password");
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Attach user to the request object for later use
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is the owner of the post
const authorizePostOwner = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.User_Id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to  this post" });
    }

    next(); // Proceed if the user is the owner of the post
  } catch (error) {
    console.error("Error checking post ownership:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { authenticateTokenEdit, authorizePostOwner };
