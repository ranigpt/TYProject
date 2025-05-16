const Post = require("../../models/RecuiterPostData");
const mongoose = require("mongoose");

const deletePost = async (req, res) => {
    const { id } = req.params;
    console.log("Request Params:", req.params);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID format." });
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found." });
        }

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = deletePost;
