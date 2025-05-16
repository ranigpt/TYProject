const TempUser = require('../models/TempUser.model');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const Recruitercol = require('../models/Register');
//const sendOTP = require('../config/sendSMS'); // Import SMS function

const Signup = async (req, res) => {
    try {
        const { Name, Email, Dob, Password, Phone } = req.body;
        const userExists = await Recruitercol.findOne({ Phone });

        if (userExists) {
            return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
        }

        const hashpassword = crypto.createHash('sha256').update(Password).digest('hex');

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 2 * 60 * 1000; // 2-minute expiry
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
       
                // Save to TempUsers collection
        await TempUser.create({
            Name,
            Email,
            Dob,
            Phone,
            Address: '',
            Password: hashpassword,
            OTP: otp,
            OTP_Expiry: otpExpiry,
            Attempts: 0,
        });

        // Send OTP via SMS
        //await sendOTP(Phone, otp);

        res.status(200).json({ msg: 'OTP sent successfully to your phone. Please verify.' });
    } catch (error) {
        res.status(500).json({ errors: [{ msg: `Server error: ${error.message}` }] });
    }
};

module.exports = Signup;
