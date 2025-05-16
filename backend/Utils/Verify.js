const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Register'); // Your User model
const router = express.Router();

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    const companySecret = process.env.COMPANY_SECRET;

    try {
        // Verify the token
        const decoded = jwt.verify(token, companySecret);
        const userId = decoded.id;

        // Find the user by ID and update the `verify` field to true
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid or expired token!' }] });
        }

        if (user.verify) {
            return res.status(400).json({ errors: [{ msg: 'Email already verified!' }] });
        }

        user.verify = true;
        await user.save();

        res.status(200).json({ msg: 'Email successfully verified. You can now log in!' });
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: `Token verification failed: ${err.message}` }] });
    }
};

// Add the route to your router
router.get('/:token', verifyEmail);

module.exports = router;
