const express = require('express');
const router = express.Router();
const Commentdb = require('../models/Comments.model');
const { default: mongoose } = require('mongoose');
const Authentication = require('../middleware/verifytoken');

// Comment adding route
module.exports = (io) => {
  router.post('/add', Authentication, async (req, res) => {
    try {
      const { Post_Id, Comment } = req.body;

      if (!Post_Id || !Comment) {
        return res.status(400).json({ message: 'Post ID and Comment are required.' });
      }

      // Find or create the comment document for the post
      let commentDoc = await Commentdb.findOne({ Post_Id });

      if (!commentDoc) {
        commentDoc = new Commentdb({
          Post_Id,
          Comments: [],
        });
      }

      // Create the new comment object
      const newComment = {
        _id: new mongoose.Types.ObjectId(),
        User_Id: req.user.id, // Assuming Authentication middleware sets req.user
        Comment,
        createdAt: new Date(),
      };

      // Add the new comment to the document
      commentDoc.Comments.push(newComment);
      await commentDoc.save();
      
      const populatedComment = await Commentdb.findOne(
        { Post_Id },
        { Comments: { $elemMatch: { _id: newComment._id } } }
      ).populate({
        path: "Comments.User_Id",
        select: "Name Dp",
      });
      
      
 const finalComment = populatedComment.Comments[0];

      // Emit the newComment event with the populated user details
      io.emit("newComment", {
        Post_Id,
        comment: finalComment,
      });

      // Send response back to the client
      res.status(201).json({ message: 'Comment added successfully!', comment: finalComment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Error adding comment.', error });
    }
  });

  return router;
};
