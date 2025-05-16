const User = require('../models/Register');
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const login = async (req,res)=>{
   const {Email,Password} = req.body;
   const company_secret ='kikijkdwndefjbefbhfjwnqeuwhejwbfn72662535425hsgd';

   try{

        const user = await User.findOne({Email});
      console.log("full user login.js", user);
        if(!user){
         return res.status(400).json({errors:[{msg:"user does not exist !! please register first .."}]});
        }

        
        const hashedPassword = crypto.createHash('sha256').update(Password).digest('hex');

        if(user.Password!==  hashedPassword){
          
          return res.status(400).json({errors:[{msg:"email or password is incorrect"}]});
 
        }

        console.log(`user is logged in ${user.Email}`);
        //console.log(user);
        console.log("userid checking");
        console.log(user._id);

        const token = jwt.sign(
          {
            id: user._id,
            email : user.Email,
            
          },
          company_secret,
          {
            expiresIn: "10h",
          }
        );
        //user.token = token
        console.log("login.js",token);
        //console.log("token checking",user.token);
        return res.status(200).json({
          message: "You are logged in successfully",
    user: {
        id: user._id,
        email: user.Email,
    },
    token: token
        });
   }catch(e){
     
    return res.status(500).json({errors:[{msg:`Server error ${e}`}]});

   }
    
}

module.exports = login;