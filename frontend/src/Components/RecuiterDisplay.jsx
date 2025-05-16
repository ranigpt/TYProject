 import React, { useState , useEffect } from "react";
import { useRecuiterPost } from "../hooks/useRecuiterPost";
import ReComments from "./ReComments";
import axios from "axios";
import ReDeletePost from "./ReDeletePost";
function RecuiterPostDisplay({ onCreatePost }) {
 // const {  loading, error } = useRecuiterPost();
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  //const [posts, setPosts] = useState(postdata); // ✅ Add local state
  const [postdata, setPostData] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token"); // Get token from storage
            const response = await axios.get("http://localhost:3000/recuiter/fetchpost", {
                headers: { Authorization: token }, // Send token in headers
            });
            
console.log("Fetched Posts:", response.data);
           console.log("Recuiter Post Data:", response.data);
            setPostData(response.data);

        } catch (err) {
            setError("Error fetching posts");
        } finally {
            setLoading(false);
        }
    };
    
    fetchPosts();
}, []);
  
  
  
// useEffect(() => {
//     setPosts(postdata); // ✅ Sync with fetched data
//   }, [postdata]);
  return (
    <div className="relative bg-[#f8fafc] border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col h-full">
      {/* Create Post Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">Job Posts</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
          onClick={onCreatePost}
        >
          Create Post
        </button>
      </div>

      {/* Posts Section */}
      <div className="flex-1 overflow-y-auto relative">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : postdata?.length === 0 ? (
          <p className="text-center text-gray-500">No job posts available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            
            {postdata?.map((post) => (
              <div
                key={post._id}
                className={`p-4 rounded-lg border border-gray-300 shadow-lg transition-all duration-500 
                  ${
                    expandedPostId && expandedPostId !== post._id
                      ? "blur-sm opacity-50"
                      : "bg-white hover:shadow-2xl hover:scale-[1.02] transition-shadow"
                  }
                  ${
                    expandedPostId === post._id
                      ? "z-50 fixed inset-0 bg-white p-8 max-w-6xl m-auto overflow-y-auto transition-all ease-in-out duration-500"
                       : ""
                  }
                `}
                style={{
                  transform: expandedPostId === post._id ? "scale(1.05)" : "scale(1)",
                  maxHeight: expandedPostId === post._id ? "90vh" : "auto",
                }}
              >
                <ReDeletePost postId={post._id} setPosts={setPostData} posts={postdata} />
                {/* Expanded View */}
                {expandedPostId === post._id ? (
                  <div className="relative overflow-y-auto h-full pr-4">
                    <button
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md transition"
                      onClick={() => setExpandedPostId(null)}
                    >
                      ✖
                    </button>

                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-6">
                     
 

                      <div className="flex-1 space-y-4">
  <h3 className="font-bold text-3xl text-blue-600 tracking-wide">
    {post.title}
  </h3>
  <p className="text-gray-700">{post.description}</p>

  {post.location && <p className="text-gray-600">📍 {post.location}</p>}
  {post.salary && <p className="text-green-600 font-bold">💰 {post.salary}</p>}
  
  {post.skills && post.skills.length > 0 && (
    <p className="text-gray-500">🔗 Skills: {post.skills.join(", ")}</p>
  )}

  {post.experience && (
    <p className="text-gray-500">👨‍🔧 Experience: {post.experience} years</p>
  )}

  {post.jobCategory && <p className="text-gray-500">🧑‍💼 Category: {post.jobCategory}</p>}

  {post.jobType && <p className="text-gray-500">⏰ Job Timing: {post.jobType}</p>}

  {post.jobLink && (
    <p className="text-gray-500">
      🔗 Apply Now:{" "}
      <a
        href={post.jobLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {post.jobLink}
      </a>
    </p>
  )}
</div>


                      {/* Right Side: Image & Comments */}
                      {post.image ? (
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
                      ) : (
                        <div className="flex-1">
                          <div className="overflow-y-auto max-h-96">
                            <ReComments postId={post._id} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Collapsed View */
                  <div className="flex flex-col space-y-2 h-full">
                    <h3 className="font-bold text-xl text-blue-600 tracking-wide">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 truncate">
                      {post.description.length > 50
                        ? post.description.substring(0, 50) + "..."
                        : post.description}
                    </p>
                    {post.description.length > 50 && (
                      <span
                        className="text-blue-500 text-sm cursor-pointer hover:underline"
                        onClick={() => setExpandedPostId(post._id)}
                      >
                        Read more
                      </span>
                    )}
                    <p className="text-green-600 font-bold">💰 {post.salary}</p>
                    <p className="text-gray-700">📍 {post.location}</p>
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

export default RecuiterPostDisplay;
