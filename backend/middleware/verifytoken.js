const jwt = require("jsonwebtoken");
const User = require("../models/Register");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

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

module.exports = authenticateToken;
