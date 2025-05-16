const express = require('express');
const router = express.Router();
const ReProfile = require('../../models/ReProfile.model');
const { check, validationResult } = require('express-validator');

router.post('/update', UpdateProfile);

router.post('/fetch' , FetchProfile);

module.exports = router;