import React from "react";
import axios from "axios";

function ReactionComment({ commentId, RePost_Id, reactions, setComments }) {
  const handleReaction = async (reactionType) => {
    try {
      await axios.post("http://localhost:3000/Reactions/react", {
        commentId,
        reaction: reactionType,
        RePost_Id,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                reactions: {
                  ...comment.reactions,
                  [reactionType]: (comment.reactions?.[reactionType] || 0) + 1,
                },
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  return (
    <div className="flex space-x-2 ml-10">
      <button
        onClick={() => handleReaction("Interested")}
        className="text-blue-500"
      >
        Interested ({reactions?.Interested || 0})
      </button>
      <button
        onClick={() => handleReaction("IWant")}
        className="text-green-500"
      >
        I Want ({reactions?.IWant || 0})
      </button>
      <button
        onClick={() => handleReaction("Amazing")}
        className="text-red-500"
      >
        Amazing ({reactions?.Amazing || 0})
      </button>
    </div>
  );
}

export default ReactionComment;
