const mongoose = require('mongoose');

   const CommentDetails = mongoose.Schema({
  Post_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },

  Comments :[ 
    {
      _id :{type : mongoose.Schema.Types.ObjectId , default : () => new mongoose.Types.ObjectId()},
     User_Id : 
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
     },
     Comment :{
      type : String 
     },

     createdAt : {
      type : Date,
      default : Date.now
     },
    
  },

],
 
chunkIndex : {type : Number , default : 0}
}, { timestamps: true });


const Comments = mongoose.model('Comment', CommentDetails);

module.exports = Comments;
