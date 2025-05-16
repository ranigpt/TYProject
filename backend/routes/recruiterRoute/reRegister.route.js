const express = require('express');
const mongoose = require('mongoose');
const Signup = require('../../controller/RecruiterController/Signup');
const app = express();
const{validateRegistration,handleValidationErrors} = require('../middleware/validationResgister');
//const passport = require('passport');


const router = express.Router();

router.post('/reSignupurl' ,validateRegistration,handleValidationErrors, Signup );

//Wrong Hai Dont Touch I willl remove later
module.exports = router;


