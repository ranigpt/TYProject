const express = require('express');
const router = express.Router();
const Signup = require('../../controller/RecruiterController/Signup');

router.post('/', Signup);
module.exports = router;
