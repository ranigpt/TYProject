const express = require('express');
const router = express.Router();
const { forgotPassword, verifyOTP, resetPassword } = require('../controller/ForgetPasswordUser');

router.post('/forgetpassword', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
