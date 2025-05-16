const mongoose = require('mongoose');

const PostDetails = mongoose.Schema({
  PostDescription: {
    type: String,
  },
  Media: {
    type: String,
  },
  MediaType :{
    type : String,
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Post = mongoose.model('Post', PostDetails);

module.exports = Post;
