const express = require('express');
const app = express();
const loginfunc = require('../controller/login');
const router = express.Router();

router.post('/' , loginfunc);

// router.get('/loginsucceed' , (req,res)=>{
//     console.log('manual login',req.user)

//     if(req.user){
//         res.status(200).json({
//             success: true,
//             user: req.user,
//             token: req.user.token, // Assuming `token` is attached to `req.user`
//         });
//     }else{
//         res.status(401).json({message : "Not  Authorized from manual login "});
//     }
   

// })

module.exports = router;