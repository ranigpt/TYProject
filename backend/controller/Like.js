const Like = require("../models/Likes.models");

// const handleLike = async (req, res) => {
//   const { postId, userId, action } = req.body;

//   try {
//     let like = await Like.findOne({ Post_Id: postId });

//     if (!like) {
//       // Create a new entry if it doesn't exist
//       like = new Like({ Post_Id: postId, User_Id: userId, count: 0 });
//     }

//     if (action === "like") {
//       like.count += 1; // Increment the like count
//     } else if (action === "unlike" && like.count > 0) {
//       like.count -= 1; // Decrement the like count
//     }

//     await like.save();

//     io.emit("newLikes" , like.count);

//     res.status(200).json({ likeCount: like.count });
//   } catch (error) {
//     console.error("Error handling like:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };


const handleLike = async (req, res, io) => {
  const { postId, userId, action } = req.body;

  if (!postId || !userId || !action) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    let like = await Like.findOne({ Post_Id: postId });

    if (!like) {
      like = new Like({ Post_Id: postId, User_Id: userId, count: 0 });
    }

    if (action === "like") {
      like.count += 1;
    } else if (action === "unlike" && like.count > 0) {
      like.count -= 1;
    }

    await like.save();
    // Emit the like count along with the postId
    io.emit("newLikes", { postId, likeCount: like.count });

    res.status(200).json({ likeCount: like.count });
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const getLikes = async (req, res) => {
  const { id: postId } = req.params;

  try {
    const like = await Like.findOne({ Post_Id: postId });

    if (!like) {
      return res.status(200).json({ likeCount: 0 });
    }

    res.status(200).json({ likeCount: like.count });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



module.exports = { handleLike, getLikes };
