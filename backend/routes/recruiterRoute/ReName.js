const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const jwt = require("jsonwebtoken"); // Import JWT
const Recruiterdata = require("../../models/ReRegister.model");
const Authcheck = require("../../middleware/Remiddleware/ReLoginMiddleware");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    console.log("Uploads directory does not exist, creating now...");
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log("Uploads directory already exists:", uploadDir);
}

// ⚡ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Uploading file to:", uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        console.log("Generated filename:", uniqueName);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// ✅ Middleware to Verify Token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
        return res.status(403).json({ message: "❌ No token provided" });
    }

    jwt.verify(token, process.env.COMPANY_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "❌ Invalid token" });
        }
        req.user = decoded; // Store decoded user data in request
        next();
    });
};

// ✅ Update Recruiter Name API
router.put("/updateName/:Phone", verifyToken, async (req, res) => {
    try {
        console.log("Received request to update name for Phone:", req.params.Phone);
        console.log("Request body:", req.body);

        const { Phone } = req.params;
        const { Name } = req.body;

        if (!Name) {
            return res.status(400).json({ message: "❌ Name is required" });
        }

        const updatedRecruiter = await Recruiterdata.findOneAndUpdate(
            { Phone },
            { $set: { Name } },
            { new: true }
        );

        if (!updatedRecruiter) {
            console.log("Recruiter not found for Phone:", Phone);
            return res.status(404).json({ message: "Recruiter not found" });
        }

        console.log("✅ Name updated successfully!", updatedRecruiter);
        res.status(200).json({ message: "✅ Name updated successfully!", recruiter: updatedRecruiter });

    } catch (error) {
        console.error("❌ Update error:", error);
        res.status(500).json({ message: "❌ Error updating recruiter name", error });
    }
});

// ✅ Update Recruiter Profile Picture API
router.put("/updateDp/:Phone", verifyToken, upload.single("Dp"), async (req, res) => {
    try {
        console.log("Received request to update profile picture for Phone:", req.params.Phone);
        console.log("Uploaded file:", req.file);

        const { Phone } = req.params;
        const Dp = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!Dp) {
            return res.status(400).json({ message: "❌ No file uploaded" });
        }

        const updatedRecruiter = await Recruiterdata.findOneAndUpdate(
            { Phone },
            { $set: { Dp } },
            { new: true }
        );

        if (!updatedRecruiter) {
            console.log("Recruiter not found for Phone:", Phone);
            return res.status(404).json({ message: "Recruiter not found" });
        }

        // console.log("✅ Profile picture updated successfully!", updatedRecruiter);
        // res.status(200).json({ message: "✅ Profile picture updated successfully!", recruiter: updatedRecruiter });
        console.log("✅ Profile picture updated successfully!", updatedRecruiter);
        res.status(200).json({ recruiter: { ...updatedRecruiter.toObject(), Dp: `/uploads/${req.file.filename}` } });

    } catch (error) {
        console.error("❌ Update error:", error);
        res.status(500).json({ message: "❌ Error updating recruiter picture", error });
    }
});

// ✅ Serve Uploaded Images
router.use("/uploads", cors(),express.static(uploadDir));

module.exports = router;
