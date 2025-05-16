const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const RUser = require('../../models/ReRegister.model');

// Login with password (using crypto for hashing)
router.post("/password", async (req, res) => {
    const { Phone, Password } = req.body;

    // Log incoming data for debugging
    console.log("Received login request:", { Phone, Password });

    try {
        // Find user by phone number
        const user = await RUser.findOne({ Phone });
        if (!user) {
            console.log("User not found!");
            return res.status(404).json({ message: "User not found!" });
        }

        // Hash the entered password using crypto (SHA256) for comparison
        const hashedPassword = crypto.createHash("sha256").update(Password).digest("hex");
        console.log("Hashed entered password:", hashedPassword);

        // Compare hashed password with the stored hashed password
        if (hashedPassword !== user.Password) {
            console.log("Invalid credentials!");
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Create JWT token for authenticated user
        const token = jwt.sign({ id: user._id, Phone: Phone }, process.env.COMPANY_SECRET|| "default_secret", {
            expiresIn: "10h",
        });
        console.log("Login successful, token generated!");
      console.log("recuiter login token" ,token);
        // Respond with token and user data
        res.json({ token, user });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

module.exports = router;
