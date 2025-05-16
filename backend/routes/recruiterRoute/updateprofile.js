const express = require("express");
const mongoose = require("mongoose");
const Recruiterdata = require("../../models/ReRegister.model"); // Adjust the path if needed
const router = express.Router();

// Update Recruiter Information
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // console.log("Received Update Request:");
        // console.log("ID:", id);
        // console.log("Update Data:", updateData);

        // Validate if `id` is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid recruiter ID" });
        }

        // Find and update recruiter
        const updatedRecruiter = await Recruiterdata.findByIdAndUpdate(
            id,
            { $set: updateData },  // Use `$set` to ensure only provided fields are updated
            { new: true }
        );

        if (!updatedRecruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        console.log("Updated Recruiter Data:", updatedRecruiter);

        res.status(200).json(updatedRecruiter);
    } catch (error) {
        console.error("Error updating recruiter:", error);
        res.status(500).json({ message: "Error updating recruiter", error });
    }
});


module.exports = router;
