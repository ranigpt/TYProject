import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdComment } from "react-icons/md";
import { io } from "socket.io-client";


// Connect to Socket.io server
const socket = io("http://localhost:3000");
const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0); // Track total comment count


  // Fetch comments and total count from the server
  // const fetchComments = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`http://localhost:3000/getcomments/${postId}`);
  //     const sortedComments = response.data.comments.sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );
  //     setComments(sortedComments);
  //     setTotalCount(response.data.totalCount); // Set total count
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //     toast.error("Failed to load comments.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/getcomments/${postId}`);
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
        "http://localhost:3000/comments/add",
        { Post_Id: postId, Comment: newComment },
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
        className="flex items-center text-gray-600 hover:text-blue-500"
      >
        <MdComment size={20} />
        <span className="ml-1 text-sm font-medium">
          {totalCount} {totalCount === 1 ? "Comment" : "Comments"}
        </span>
      </button>


      {isCommentsVisible && (
        <div className="mt-4 border-t pt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>


          {loading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="mb-4 border-b pb-2">
                <div className="flex items-center space-x-2">
                {console.log("comments id",comment?._id)}
                {console.log("comments user id",comment?.UserDetails?._id)}

                  {console.log("comments user",comment.UserDetails)}
                  {comment.UserDetails?.Dp && (
                    <img
                      src={comment.UserDetails.Dp}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <p className="font-semibold">{comment.UserDetails?.Name || "Anonymous"}</p>
                </div>


                <p className="ml-10 text-gray-700">{comment.Comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};










export default Comments;



