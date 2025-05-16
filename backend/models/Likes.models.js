const mongoose = require('mongoose');

const LikeDetails = mongoose.Schema({
  Post_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  count :{
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Like = mongoose.model('Like', LikeDetails);

module.exports = Like;
