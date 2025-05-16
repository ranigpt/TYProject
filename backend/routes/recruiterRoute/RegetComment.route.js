const express = require('express');
const router = express.Router();
const ReCommentdb = require('../../models/ReComments.model');
const { default: mongoose } = require('mongoose');

router.get('/:RepostId', async (req, res) => {
  try {
    const { RepostId } = req.params;

    const comments = await ReCommentdb.aggregate([
      { $match: { RePost_Id: new mongoose.Types.ObjectId(RepostId) } }, // Match post ID
      { $unwind: '$Comments' }, // Unwind the Comments array
      { $sort: { 'Comments.createdAt': -1 } }, // Sort by createdAt

      // Lookup from 'recruiterdatas' collection
      {
        $lookup: {
          from: 'recruiterdatas',
          localField: 'Comments.ReUser_Id',
          foreignField: '_id',
          as: 'RecruiterDetails',
        },
      },

      // Lookup from 'users' collection
      {
        $lookup: {
          from: 'users',
          localField: 'Comments.ReUser_Id',
          foreignField: '_id',
          as: 'UserDetails',
        },
      },

      // Merge both user details into a single array and pick the first available one
      {
        $addFields: {
          'Comments.UserDetails': {
            $arrayElemAt: [{ $concatArrays: ['$RecruiterDetails', '$UserDetails'] }, 0],
          },
        },
      },

      {
        $group: {
          _id: '$_id',
          Comments: { $push: '$Comments' },
          TotalCount: { $sum: 1 }, // Correct total count calculation
        },
      },
    ]);

    return res.status(200).json({
      comments: comments.length > 0 ? comments[0].Comments : [],
      totalCount: comments.length > 0 ? comments[0].TotalCount : 0,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments.', error });
  }
});

module.exports = router;
