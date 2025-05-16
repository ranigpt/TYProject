import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Likes from "./Likes";
import Comments from "./Comments";

const PostDisplay = ({ posts }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {console.log("all posts ", posts)}
      {posts.map((post) => {
        const profilePic = post.User_Id?.Dp || "https://via.placeholder.com/100";
        return (
          <div key={post._id} className="p-6 rounded-md shadow-lg bg-white mb-6 transition-all hover:shadow-xl">
            <div className="flex items-center space-x-4">
              <img
                src={profilePic}
                alt="User DP"
                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.src = "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg";
                }}
              />
              <Link to={`/user/profileSee/${post.User_Id?.Email}`} className="font-semibold text-gray-800 hover:underline">
                {post.User_Id?.Name || "Unknown User"}
              </Link>
            </div>

            <p className="text-lg my-3 text-gray-700">{post.PostDescription}</p>

            {post.Media && (
              <img
                src={post.Media}
                alt="Post"
                className="w-40 h-auto rounded-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedImage(post.Media)}
              />
            )}

            <div className="flex items-center justify-between mt-4">
              <Likes postId={post._id} userId={post.User_Id} />
              <Comments postId={post._id} />
            </div>
          </div>
        );
      })}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[100vh] rounded-lg" />
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-red-600"
              onClick={() => setSelectedImage(null)}
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDisplay;
