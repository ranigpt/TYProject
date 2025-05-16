const express = require('express');
const verifyOTP = require('../../controller/RecruiterController/ReVerifyOTP');
const resendOTP = require('../../controller/RecruiterController/ResentOTP');

const router = express.Router();

router.post('/register/verify-otp', verifyOTP);
router.post('/register/resend-otp', resendOTP);

module.exports = router;
