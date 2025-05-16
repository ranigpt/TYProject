const express = require("express");
const Recruiterdata = require("../../models/ReRegister.model") // Adjust path based on your project structure
const Authceck = require("../../middleware/Remiddleware/ReLoginMiddleware") // Adjust path based on your project structure
const router = express.Router();

// ✅ Fetch all recruiters
router.get("/all", Authceck, async (req, res) => {
    try {
        const recruiters = await Recruiterdata.find();
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recruiters", error });
    }
});

// ✅ Fetch recruiter by ID
router.get("/:Phone", Authceck , async (req, res) => {
    console.log("Fetching recruiter ID:", req.params.Phone);
    console.log("Authenticated User:", req.user); // Should contain user data from Authceck

    try {
        const recruiter = await Recruiterdata.findOne({ Phone: req.params.Phone }); // ✅ Corrected
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        res.status(200).json(recruiter);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recruiter", error });
    }
});

// ✅ Fetch recruiters by hiring status
router.get("/status/:status", async (req, res) => {
    try {
        const { status } = req.params;
        const recruiters = await Recruiterdata.find({ Status: status });
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Error filtering recruiters", error });
    }
});



module.exports = router;
