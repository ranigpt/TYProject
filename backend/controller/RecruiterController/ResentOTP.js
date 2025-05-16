const TempUser = require('../../models/TempUser.model');
const nodemailer = require("nodemailer");
require("dotenv").config();

const resendOTP = async (req, res) => {
    try {
        const { Phone, Email } = req.body;
        const tempUser = await TempUser.findOne({ $or: [{ Phone }, { Email }] });

        if (!tempUser) {
            return res.status(400).json({ errors: [{ msg: 'User not found!' }] });
        }

        // **New OTP Generate kar**
        const newOTP = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 2 * 60 * 1000;

        // **DB me update kar de**
        await TempUser.updateOne({ _id: tempUser._id }, { OTP: newOTP, OTP_Expiry: otpExpiry, Attempts: 0 });

        // **Nodemailer se Email bhej**
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: Email,
            subject: "Your New OTP Code",
            text: `Your new OTP is ${newOTP}. It will expire in 2 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP resent to ${Email}`);

        res.status(200).json({ msg: 'New OTP sent successfully.' });

    } catch (error) {
        console.error("🚨 Error resending OTP:", error);
        res.status(500).json({ errors: [{ msg: `Server error: ${error.message}` }] });
    }
};

module.exports = resendOTP;
