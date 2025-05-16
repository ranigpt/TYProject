
const express = require("express");
const router = express.Router();
const ReCommentdb = require("../../models/ReComments.model");
const { default: mongoose } = require("mongoose");
const AuthCheck = require("../../middleware/Remiddleware/ReLoginMiddleware");


module.exports = (io) => {
router.post("/react", AuthCheck, async (req, res) => {
    try {
      const { commentId, reaction, RePost_Id } = req.body;
      const validReactions = ["Interested", "IWant", "Amazing"];
  
      if (!validReactions.includes(reaction)) {
        return res.status(400).json({ success: false, message: "Invalid reaction type." });
      }
  
      const updatedComment = await ReCommentdb.findOneAndUpdate(
        { RePost_Id, "Comments._id": commentId },
        { $inc: { [`Comments.$.reactions.${reaction}`]: 1 } },
        { new: true }
      );
  
      if (!updatedComment) {
        return res.status(404).json({ success: false, message: "Comment not found." });
      }
  
      // Find the updated comment with populated user details
      const populatedComment = await ReCommentdb.findOne(
        { RePost_Id },
        { Comments: { $elemMatch: { _id: commentId } } }
      ).populate({
        path: "Comments.ReUser_Id",
        select: "Name",
      });
  
      const finalComment = populatedComment.Comments[0];
  
      // Emit reaction update event
      io.emit("reactionUpdated", {
        RePost_Id,
        comment: finalComment,
      });
  
      res.json({ success: true, updatedComment: finalComment });
    } catch (error) {
      console.error("Error updating reaction:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  });
  
  return router;
};