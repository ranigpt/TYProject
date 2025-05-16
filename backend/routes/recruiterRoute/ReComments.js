const express = require('express');
const router = express.Router();
const ReCommentdb = require('../../models/ReComments.model');
const { default: mongoose } = require('mongoose');
const AuthCheck = require('../../middleware/Remiddleware/ReLoginMiddleware');

// Comment adding route
module.exports = (io) => {
  router.post('/add', AuthCheck, async (req, res) => {
    try {
      const { RePost_Id, Comment } = req.body;

      if (!RePost_Id || !Comment) {
        return res.status(400).json({ message: 'Post ID and Comment are required.' });
      }

      // Find or create the comment document for the post
      let commentDoc = await ReCommentdb.findOne({ RePost_Id });

      if (!commentDoc) {
        commentDoc = new ReCommentdb({
          RePost_Id,
          Comments: [],
        });
      }

      // Create the new comment object
      const newComment = {
        _id: new mongoose.Types.ObjectId(),
        ReUser_Id: req.user.id, // Assuming Authentication middleware sets req.user
        Comment,
        createdAt: new Date(),
      };

      // Add the new comment to the document
      commentDoc.Comments.push(newComment);
      await commentDoc.save();
      
      const populatedComment = await ReCommentdb.findOne(
        { RePost_Id },
        { Comments: { $elemMatch: { _id: newComment._id } } }
      ).populate({
        path: "Comments.ReUser_Id",
        select: "Name",
      });
      
      
 const finalComment = populatedComment.Comments[0];

      // Emit the newComment event with the populated user details
      io.emit("newComment", {
        RePost_Id,
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
