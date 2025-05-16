import React, { useState, useEffect } from "react";
import { useRecuiterPostForList } from "../hooks/useRecuiterPost";
import ReComments from "../Components/ReComments";
import { Link, useNavigate } from "react-router-dom";

function JobListDisplay() {
  const { postdata, loading, error } = useRecuiterPostForList();
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageBlobUrl, setImageBlobUrl] = useState({});
  const navigate = useNavigate();

  // Convert image path to Blob URL
  useEffect(() => {
    const fetchImageBlobs = async () => {
      if (postdata) {
        const blobUrls = {};
        await Promise.all(
          postdata.map(async (post) => {
            if (post?.RecuiterId?.Dp) {
              try {
                // Ensure local path works by appending backend URL
                const imagePath = post.RecuiterId.Dp.startsWith("/uploads")
                  ? `http://localhost:3000${post.RecuiterId.Dp}`
                  : post.RecuiterId.Dp;

                const response = await fetch(imagePath);
                const blob = await response.blob();
                blobUrls[post.RecuiterId.Dp] = URL.createObjectURL(blob);
              } catch (error) {
                console.error("Error fetching image blob:", error);
              }
            }
          })
        );
        setImageBlobUrl(blobUrls);
      }
    };

    fetchImageBlobs();
  }, [postdata]);

  // Filter posts based on search query
  const filteredPosts = postdata?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      {/* Header with Search Bar and Home Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <input
          type="text"
          placeholder="Search Jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <h1 className="text-bold font-bold text-2xl mb-4">Find Your Favorite Jobs</h1>

      <div className="flex-1 overflow-y-auto relative">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredPosts?.length === 0 ? (
          <p className="text-center text-gray-500">No job posts available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {filteredPosts?.map((post) => (
              <div
                key={post._id}
                className={`p-4 rounded-lg shadow-lg transition-all duration-500 
                  ${expandedPostId && expandedPostId !== post._id ? "blur-sm opacity-50" : "bg-white"}
                  ${expandedPostId === post._id ? "z-50 fixed inset-0 bg-white p-8 max-w-6xl m-auto overflow-y-auto" : ""}
                `}
                style={{
                  transform: expandedPostId === post._id ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s, opacity 0.3s",
                  maxHeight: expandedPostId === post._id ? "90vh" : "auto",
                }}
              >
                {expandedPostId === post._id ? (
                  <div className="relative overflow-y-auto h-full pr-4">
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md"
                      onClick={() => setExpandedPostId(null)}
                    >
                      ✖
                    </button>

                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={imageBlobUrl[post?.RecuiterId?.Dp] || "default-avatar.png"}
                            alt="Recruiter"
                            className="w-10 h-10 rounded-full object-cover shadow-md"
                          />
                          <Link to={`/Employer/Profile/${post?.RecuiterId?.Email}`}>
                            <p className="font-bold">{post?.RecuiterId?.Name}</p>
                          </Link>
                        </div>

                        <h3 className="font-bold text-3xl text-blue-600">{post.title}</h3>
                        <p className="text-gray-600">{post.description}</p>
                        <p className="text-gray-600">📍 {post.location}</p>
                        <p className="text-green-600 font-bold">💰 {post.salary}</p>
                        <p className="text-gray-500">👨‍🔧 Experience: {post.experience} years</p>
                        <p className="text-gray-500">🧑‍💼 Category: {post.jobCategory}</p>
                        <p className="text-gray-500">⏰ Job Timing: {post.jobType}</p>
                      </div>

                      {post.image && (
                        <div className="flex-1 space-y-4">
                          <img
                            src={post.image}
                            alt="Job"
                            className="w-full h-auto object-contain rounded-lg shadow-md"
                          />
                          <div className="overflow-y-auto max-h-96">
                            <ReComments postId={post._id} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 h-full">
                    <div className="flex items-center space-x-4">
                      <img
                        src={imageBlobUrl[post?.RecuiterId?.Dp] || "default-avatar.png"}
                        alt="Recruiter"
                        className="w-10 h-10 rounded-full object-cover shadow-md"
                      />
                      <Link to={`/Employer/Profile/${post?.RecuiterId?.Email}`}>
                        <p className="font-bold">{post?.RecuiterId?.Name}</p>
                      </Link>
                    </div>

                    <h3 className="font-bold text-xl text-blue-600">{post.title}</h3>
                    <p className="text-gray-600 truncate">
                      {post.description.length > 50
                        ? post.description.substring(0, 50) + "..."
                        : post.description}
                    </p>
                    <p className="text-green-600 font-bold">💰 {post.salary}</p>
                    <p className="text-gray-600">📍 {post.location}</p>
                    <ReComments postId={post._id} />
                    <button
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                      onClick={() => setExpandedPostId(post._id)}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListDisplay;
