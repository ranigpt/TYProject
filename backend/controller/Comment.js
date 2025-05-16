
const CommentsDB = require('../models/Comments.model');
const Post = require('../models/PostData');

const Comments = async(req , res) => {
    const { postId } = req.params;
    const { commentText } = req.body;
    const userId = req.user.id;

    try {
        if (!commentText) {
            return res.status(400).json({ message: "Comment text cannot be empty." });
        }
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        
   const newComment = new CommentsDB ({
            CommentText: commentText,
            User_Id: userId,
        });

        await newComment.save();
    }
   catch (error) {
        console.error("Error saving comment:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}