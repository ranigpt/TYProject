const express = require('express');
const router = express.Router();
const Post = require('../models/PostData');
const multer = require ("multer");
const updatePost = require('../controller/UpdateController');

const cloudinary = require("../config/Cloudinary");
const { authenticateTokenEdit, authorizePostOwner } = require("../middleware/posteditmiddleware");

const storage = multer.diskStorage({});
const upload = multer({ storage });

module.exports = (io)=>{
    const updatePost = require('../controller/UpdateController')(io);

    router.put("/:id",upload.single("Media") , authenticateTokenEdit ,authorizePostOwner ,  updatePost); 
    return router;
}

