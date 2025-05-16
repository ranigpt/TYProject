const TempUser = require("../models/TempUser.model");
const sendOTP = require("../config/sendSMS");
const crypto = require('crypto');
const sendOTPUtility = require('../Utils/sendOTP')
const User = require("../models/Register");


exports.forgotPassword = async (req, res) => {
    let { contact } = req.body;

    try {
        let user;
        const isPhone = /^\d{10}$/.test(contact);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

        if (isPhone) {
            user = await User.findOne({ Phone: contact });

            if (!user || !user.Email) {
                return res.status(400).json({ msg: "User not found or email missing!" });
            }

            contact = user.Email; // Use associated email for OTP
        } else if (isEmail) {
            user = await User.findOne({ Email: contact });

            if (!user) {
                return res.status(400).json({ msg: "User not found!" });
            }
        } else {
            return res.status(400).json({ msg: "Invalid email or phone number format!" });
        }

        // Generate OTP and expiry time
        const newOTP = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        // Store or update OTP in TempUser
        await TempUser.updateOne(
            { Phone:user.Phone }, // Search by contact (email or phone)
            { $set: { OTP: newOTP, OTP_Expiry: otpExpiry, contact } },
            { upsert: true } // Create new entry if it doesn't exist
        );

        // Send OTP via Email
        const otpSent = await sendOTPUtility(contact, newOTP);
        if (!otpSent) {
            return res.status(500).json({ msg: "Failed to send OTP!" });
        }

        return res.status(200).json({ msg: "OTP sent successfully!" });

    } catch (error) {
        console.error("Error in forgot password:", error);
        return res.status(500).json({ msg: "Internal server error!" });
    }
};






exports.verifyOTP = async (req, res) => {
    const { contact, otp } = req.body;
    const tempUser = await TempUser.findOne({ Phone : contact });

    if (!tempUser || tempUser.OTP !== parseInt(otp, 10) || tempUser.OTP_Expiry < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP!" });
    }
      console.log("✅ OTP Verified! Registering User...");
    res.status(200).json({ msg: "OTP Verified!" });
};

exports.resetPassword = async (req, res) => {
    console.log("Received request body:", req.body); // Debugging

    const { contact, password } = req.body;
    if (!contact || !password) {
        return res.status(400).json({ msg: "Missing email/phone or password!" });
    }

        const hashpassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await User.findOne({ Phone: contact });

    if (!user) {
        return res.status(400).json({ msg: "User not found!" });
    }

    user.Password = hashpassword;
    await user.save();

    res.status(200).json({ msg: "Password reset successfully!" });
};
