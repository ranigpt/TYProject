import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdComment } from "react-icons/md";
import { io } from "socket.io-client";
import {Link } from "react-router-dom"

// Connect to Socket.io server
const socket = io("http://localhost:3000");

const ReComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0); // Track total comment count

  
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/Regetcomments/${postId}`);
      let sortedComments = response.data.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Convert images to blobs
      const commentsWithBlobs = await Promise.all(
        sortedComments.map(async (comment) => {
          if (comment.UserDetails?.Dp) {
            try {
              const imageResponse = await fetch(`http://localhost:3000${comment.UserDetails.Dp}`);

              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                return {
                  ...comment,
                  UserDetails: {
                    ...comment.UserDetails,
                    Dp: URL.createObjectURL(blob), // Convert Blob to Object URL
                  },
                };
              }
            } catch (error) {
              console.error("Error loading profile picture:", error);
            }
          }
          return comment;
        })
      );

      setComments(commentsWithBlobs);
      setTotalCount(response.data.totalCount); // Set total count
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };






  // Add new comment
  const handleAddComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to log in to comment.");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/Recomments/add",
        { RePost_Id: postId, Comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment(""); // Clear input
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  // Update count and comments when a new comment is added
  const handleNewComment = (data) => {
    if (data.Post_Id === postId) {
      setComments((prev) => {
        if (!prev.find((c) => c._id === data.comment._id)) {
          setTotalCount((prevCount) => prevCount + 1); // Increment total count
          return [
            {
              ...data.comment,
              UserDetails: data.comment.User_Id,
            },
            ...prev,
          ];
        }
        return prev;
      });
    }
  };

  // UseEffect to handle socket and fetch comments
  useEffect(() => {
    fetchComments();

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [postId]);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsCommentsVisible((prev) => !prev)}
        className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300"
      >
        <MdComment size={20} />
        <span className="ml-1 text-sm font-medium">
          {totalCount} {totalCount === 1 ? "Comment" : "Comments"}
        </span>
      </button>

      {isCommentsVisible && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center mb-4 space-x-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
            >
              Add
            </button>
          </div>

          {loading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="mb-4">
                <div className="flex items-start space-x-3">
                  {console.log("recuiter side ",comment?.UserDetails)}
                  {console.log("recuiter side ",comment?.UserDetails?.Dp)}

                  {comment.UserDetails?.Dp ? (
                    <img
                      src={comment.UserDetails.Dp}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <img
                      src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="
                      alt="Default Avatar"
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                  )}

                  <div className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm w-full">
                  <Link to={`/user/profileSee/${comment?.UserDetails?.Email}`}>
                    <p className="font-semibold text-gray-800">{comment.UserDetails?.Name || "Anonymous"}</p>
                    </Link>
                    <p className="text-gray-700">{comment.Comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReComments;
