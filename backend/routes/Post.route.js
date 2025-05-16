const express = require('express');
const router = express.Router();
const multer = require('multer');
const PostController = require('../controller/PostController');
const AuthenticateToken = require('../middleware/verifytoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});



const upload = multer({
    storage: multer.memoryStorage(), // Use memoryStorage to get file buffer

    limits: { fileSize: 30 * 1024 * 1024 }, // 2MB limit
    fileFilter : (req , file , cb)=>{
        if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
            cb(null, true);
        }
        else{

            cb(new Error("Unsupported file type: "), false);
        }
    }
});

// Middleware to handle Multer errors
const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
    }
    next();
};

// Define the route
//  router.post(
//     '/create', AuthenticateToken, 
//     upload.single('Media'), // Multer middleware for file uploads
//    multerErrorHandler,         // Error handler for Multer
//     PostController              // Main controller for the request
// );

// module.exports = router;

module.exports = (io) => {
    const PostController = require('../controller/PostController')(io); // Pass `io` here
    
    router.post(
      '/create', 
      AuthenticateToken, 
      upload.single('Media'), 
      multerErrorHandler, 
      PostController // Use the updated controller
    );
  
    return router;

}
