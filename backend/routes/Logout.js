
const express = require('express');
const router = express.Router();

//logout fuction and router

// router.get('/', LogoutHandler);

// const LogoutHandler = ()=>{

// }


router.get('/', (req,res,next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        console.log('User logged out');
        res.clearCookie('token');
       // res.status(200).json({message : "User Logout"});
       res.redirect('http://localhost:5173/');
    });
    //res.redirect('http://localhost:5173/');
})

module.exports = router;