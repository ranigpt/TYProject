const mongoose = require('mongoose');

const registerRecruiter = mongoose.Schema({
    
    
    Name: {
        type: String,
        required: true,
    },
    Dp: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    },
    Phone: {
        type: String, // Changed from Date to String
        unique: true,
        required: true,
    },
    Email:{
        type: String,
        required: true,
        unique: true,
    },
    Status: {
        type: String, // Example: "Hiring Now", "Not Hiring"
        default: "Hiring Now",
    },
    Password: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false, // For admin-verified recruiters
    },
    CompanyName: {
        type: String, // Some recruiters may not have a company
    },
    Designation: {
        type: String, // Example: "Factory HR", "Construction Manager"
    },
    Industry: {
        type: String, // Example: "Construction", "Manufacturing", "Transport"
    },
    Experience: {
        type: Number, // Years of recruiting experience
    },
    HiringLocation: {
        type: String, // Example: "Mumbai", "Delhi", "Pune"
    },
    JobTypes: {
        type: [String], // Example: ["Full-Time", "Daily Wage", "Contract"]
    },
    JobListings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobPost", // Reference to job postings
        },
    ],
});

const Recruiterdata = mongoose.model("RecruiterData", registerRecruiter);

module.exports = Recruiterdata;
