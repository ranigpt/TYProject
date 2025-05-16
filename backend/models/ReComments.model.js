const mongoose = require('mongoose');

   const CommentDetails = mongoose.Schema({
  RePost_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecuiterPostData',
    required: true,
  },

  Comments :[ 
    {
      _id :{type : mongoose.Schema.Types.ObjectId , default : () => new mongoose.Types.ObjectId()},
     ReUser_Id : 
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruiterData',
     },
     Comment :{
      type : String 
     },

     reactions: {
      Interested: { type: Number, default: 0 },
      IWant: { type: Number, default: 0 },
      Amazing: { type: Number, default: 0 },
    },

     createdAt : {
      type : Date,
      default : Date.now
     },
    
  },

],
 
chunkIndex : {type : Number , default : 0}
}, { timestamps: true });


const Comments = mongoose.model('ReComment', CommentDetails);

module.exports = Comments;
