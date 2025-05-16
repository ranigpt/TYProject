const express = require('express');
const mongoose = require('mongoose');
const Signup = require('../controller/Signup');
const app = express();
const{validateRegistration,handleValidationErrors} = require('../middleware/validationResgister');
//const passport = require('passport');
const passport = require('../config/Passpost');


const router = express.Router();

router.post('/reSignupurl' ,validateRegistration,handleValidationErrors, Signup );


module.exports = router;


