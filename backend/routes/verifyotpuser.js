const express = require('express');
const verifyOTP = require('../controller/UserVerifyOTP');
//const resendOTP = require('../controller/ForgetPasswordUser');

const router = express.Router();

router.post('/user/verify-otp', verifyOTP);
//router.post('/user/resend-otp', resendOTP);

module.exports = router;
