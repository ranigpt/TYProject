;const express = require('express');
const router = express.Router();
const Commentdb = require('../models/Comments.model');
const { default: mongoose } = require('mongoose');

router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Commentdb.aggregate([
      { $match: { Post_Id: new mongoose.Types.ObjectId(postId) } }, // Match the post
      { $unwind: '$Comments' }, // Unwind the Comments array
      { $sort: { 'Comments.createdAt': -1 } }, // Sort by createdAt in descending order
      {
        $lookup: {
          from: 'users', // Name of the User collection
          localField: 'Comments.User_Id',
          foreignField: '_id',
          as: 'UserDetails',
        },
      },
      {
        $addFields: {
          'Comments.UserDetails': { $arrayElemAt: ['$UserDetails', 0] }, // Flatten the UserDetails array
        },
      },
      {
        $group: {
          _id: '$_id',
          Comments: { $push: '$Comments' }, // Rebuild the Comments array
          TotalCount: { $sum: 1 }, // Count total comments
        },
      },
    ]);

    if (!comments || comments.length === 0) {
      return res.status(200).json({ comments: [], totalCount: 0 });
    }

    res.status(200).json({
      comments: comments[0].Comments,
      totalCount: comments[0].TotalCount,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments.', error });
  }
});


module.exports = router; 