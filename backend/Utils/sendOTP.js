const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to send OTP via Email
const sendOTP = async (email, otp) => {
    try {
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log("❌ Invalid email format.");
            return false;
        }

        // Create Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Email details
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 2 minutes.`
        };

        // Send Mail
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
        return false;
    }
};

module.exports = sendOTP;
