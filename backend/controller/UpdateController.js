
const Post = require('../models/PostData');
const multer = require ("multer");
const cloudinary = require("../config/Cloudinary");

const UpdateController = (io) => async (req, res) => {
    const { id } = req.params;
    const { PostDescription } = req.body;
  
    if (!PostDescription || PostDescription.trim() === "") {
      return res.status(400).json({ message: "Post description cannot be empty." });
    }
  
    try {
       const updateData = { PostDescription };
      if (req.file) {
        //upload new image to cloudinary

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder:"user_posts"
        });
        updateData.Media = result.secure_url || null;
        //updateData.MediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
        updateData.MediaType = req.file.mimetype;
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id, 
        { $set: updateData },

        { new: true }
      ).populate("User_Id", "Name Dp");

      io.emit("update-post" , updatedPost);
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      res.status(200).json({ 
        message: "Post updated successfully", 
        post: updatedPost 
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }


  module.exports =(io) => UpdateController(io);
