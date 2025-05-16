const nodemailer = require("nodemailer");
const TempUser = require('../../models/TempUser.model');
const crypto = require('crypto');
const Recruitercol = require('../../models/ReRegister.model');
require("dotenv").config();

const Signup = async (req, res) => {
    try {
        const { Name, Email, Dob, Password, Phone } = req.body;

        console.log(`📩 Signup Attempt: Name=${Name}, Email=${Email}, Phone=${Phone}`);

        const userExists = await Recruitercol.findOne({ Email });
        if (userExists) {
            console.log("⚠️ User already exists in Recruitercol.");
            return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
        }

        const hashpassword = crypto.createHash('sha256').update(Password).digest('hex');
        const otp = Math.floor(100000 + Math.random() * 900000); // Convert OTP to a number
        const otpExpiry = Date.now() + 2 * 60 * 1000;

        console.log(`🔢 Generated OTP: ${otp} for Email: ${Email}`);

        // Send OTP to Email
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
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${Email}`);

        await TempUser.create({
            Name,
            Email,
            Dob,
            Phone,
            Password: hashpassword,
            OTP: otp,
            OTP_Expiry: otpExpiry,
            Attempts: 0,
        });

        res.status(200).json({ msg: 'OTP sent to your email. Please verify.' });

    } catch (error) {
        console.error("🚨 Registration Error:", error);
        res.status(500).json({ errors: [{ msg: `Server error: ${error.message}` }] });
    }
};

module.exports = Signup;
