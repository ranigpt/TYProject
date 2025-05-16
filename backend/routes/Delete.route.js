const express = require("express");
const Post = require("../models/PostData");
const { authenticateTokenEdit, authorizePostOwner } = require("../middleware/posteditmiddleware");

module.exports = (io) => {
    const router = express.Router();

    router.delete("/:id", authenticateTokenEdit, authorizePostOwner, async (req, res) => {
        const { id } = req.params;

        try {
            const deletedPost = await Post.findByIdAndDelete(id);

            if (!deletedPost) {
                return res.status(404).json({ message: "Post not found." });
            }

            io.emit("post-deleted", id);
            res.status(200).json({ message: "Post deleted successfully." });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });

    return router;
};
