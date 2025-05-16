import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import axios from "axios";
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

// Connect to socket server
const socket = io("http://localhost:3000");

const Likes = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem("token"); // Get token from localStorage

  // Handle like/unlike toggle
  const handleLikeToggle = async () => {
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.post(
        `http://localhost:3000/api/likes`,
        { postId, userId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikeCount(res.data.likeCount); // Update total likes
      setLiked(!liked); // Toggle liked state
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(error.response?.data?.message || "Error toggling like.");
    }
  };

  // Fetch initial like count and user like status
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/likes/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikeCount(res.data.likeCount); // Set total likes
        setLiked(res.data.userLiked); // Set whether the user has liked the post
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();

    // Listen for real-time like count updates from socket
    const handleNewLikes = (data) => {
      if (data.postId === postId) {
        setLikeCount(data.likeCount); // Update like count only for the specific post
      }
    };

    socket.on("newLikes", handleNewLikes);

    return () => {
      socket.off("newLikes", handleNewLikes); // Cleanup listener on unmount
    };
  }, [postId, token]);

  return (
    <div className="flex items-center space-x-2">
      <div
        className="flex items-center cursor-pointer text-gray-600 hover:text-blue-500 transition-colors"
        onClick={handleLikeToggle}
      >
        {liked ? (
          <AiFillLike className="text-xl text-blue-500" />
        ) : (
          <AiOutlineLike className="text-xl" />
        )}
        <span className="ml-2">
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>
    </div>
  );
};

export default Likes;
