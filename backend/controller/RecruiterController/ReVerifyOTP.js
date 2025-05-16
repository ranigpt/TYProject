const TempUser = require('../../models/TempUser.model');
const User = require('../../models/ReRegister.model');

const verifyOTP = async (req, res) => {
    try {
        const { phone, email, otp } = req.body;

        console.log(`🔍 Verifying OTP for Email: ${email}, Phone: ${phone}, Entered OTP: ${otp}`);

        const tempUser = await TempUser.findOne({ 
            $or: [{ Phone: phone }, { Email: email }] 
        });

        if (!tempUser) {
            console.log("❌ No TempUser found or OTP expired.");
            return res.status(400).json({ errors: [{ msg: 'User not found or OTP expired!' }] });
        }

        if (tempUser.Attempts >= 5) {
            console.log("❌ Too many incorrect OTP attempts.");
            return res.status(403).json({ errors: [{ msg: 'Too many incorrect attempts. Request a new OTP.' }] });
        }

        if (tempUser.OTP_Expiry < Date.now()) {
            console.log("⌛ OTP expired.");
            return res.status(400).json({ errors: [{ msg: 'OTP expired. Please request a new one.' }] });
        }

        if (tempUser.OTP !== parseInt(otp, 10)) {
            await TempUser.updateOne({ $or: [{ Phone: phone }, { Email: email }] }, { $inc: { Attempts: 1 } });
            console.log("❌ Incorrect OTP entered.");
            return res.status(400).json({ errors: [{ msg: 'Incorrect OTP. Try again.' }] });
        }

        console.log("✅ OTP Verified! Registering User...");

        // Move user to permanent collection
        const newUser = new User({
            Name: tempUser.Name,
            Email: tempUser.Email,
            Phone: tempUser.Phone,
            Password: tempUser.Password,
            Dob : tempUser.Dob,
        });

        await newUser.save();
        await TempUser.deleteOne({ $or: [{ Phone: phone }, { Email: email }] });

        res.status(200).json({ msg: 'OTP Verified! Registration successful.' });
    } catch (error) {
        console.error("🚨 OTP Verification Error:", error);
        res.status(500).json({ errors: [{ msg: `Server error: ${error.message}` }] });
    }
};

module.exports = verifyOTP;
