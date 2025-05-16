const express = require('express');
const User = require('../models/Register'); // Real user database
const TempDB = require('../models/TempUser.model'); // Temporary OTP database
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🔹 **Send OTP**
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user exists in the real database
    const user = await User.findOne({ Email: email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate OTP and expiry time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    // Save OTP to TempDB
    await TempDB.findOneAndUpdate(
      { Email:email },
      { OTP:otp, 
        OTP_Expiry :otpExpiry 
    },
      { upsert: true, new: true }
    );

    // 🔹 Send OTP via Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your OTP for Phone Update',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`
    });

    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp, phone } = req.body;
      if (!email || !otp || !phone) {
        return res.status(400).json({ error: 'Email, OTP, and phone number are required' });
      }
  
      // ✅ Find the OTP record in TempDB
      const tempRecord = await TempDB.findOne({ Email: email });
      if (!tempRecord) {
        return res.status(400).json({ error: 'OTP expired or not found' });
      }
  
      // ✅ Convert OTP to number before comparing
      if (tempRecord.OTP !== Number(otp) || Date.now() > tempRecord.OTP_Expiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
  
      // ✅ Find user in the real database and update phone number
      const user = await User.findOne({ Email: email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.Phone = phone; // Update phone number
      await user.save(); // Save changes
  
      // ✅ Delete OTP record after successful verification
      await TempDB.deleteOne({ Email: email });
  
      res.json({ message: 'OTP verified and phone number updated successfully' });
      console.log("OTP verified and phone number updated successfully");
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  


module.exports = router;
