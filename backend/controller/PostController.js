const postmodel = require('../models/PostData');
const cloudinary = require("../config/Cloudinary");
// const { Server } = require('socket.io');
// const io = require("socket.io")(server);

// Utility function to upload to Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: mimetype.startsWith("video/") ? "video" : "image",
        folder: "posts",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer); // Ensure the buffer is correctly passed to the stream
  });
};

const PostController = (io)=> async (req, res) => {
  try {
    console.log("post data", req.body); // Logs the request body
    const { PostDescription } = req.body;
    const userId = req.user.id;

    console.log("post user", userId);

    if (!PostDescription || !userId) {
      return res.status(400).json({ error: "Post description & user ID are required!" });
    }

    let uploadedMedia = null;
    let mediaType = null;

    if (req.file) {
      console.log("Uploaded file", req.file);
      uploadedMedia = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const newPost = new postmodel({
      PostDescription,
      Media: uploadedMedia?.secure_url || null, // Media is null if no file is uploaded
      MediaType: mediaType, // MediaType is null if no file is uploaded
      User_Id: userId,
    });

    await newPost.save();
    const populatedPost = await newPost.populate("User_Id", "Name Dp");


console.log("populated post:", populatedPost);
     
    io.emit("new-post" , populatedPost);
   res.status(201).json({ message: "Post created successfully", post: newPost });
      
  //  io.emit("new-post" , populatedPost);

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error processing the request" });
  }
};


module.exports = PostController;