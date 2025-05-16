import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbaar from "../Components/Navbaar";
import { FaTimes } from "react-icons/fa";
import Rating from "../Components/Rating"
import { Link } from "react-router-dom";



const UserProfile = () => {
  const { email } = useParams(); // Get email from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profileImage, setProfileImage] = useState(null);
  const [modalImage, setModalImage] = useState(null); // State for modal image

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profileSee/profile/${email}`);
        setUserData(response.data);
        handleProfileImage(response.data.user.Dp); // Handle profile image
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [email]);

const handleProfileImage = async (imageUrl) => {
    if (!imageUrl) return;
  
    console.log("User Profile Image:", imageUrl);
  
    // If the image is a third-party URL (Google Sign-In DP)
    if (imageUrl.startsWith("http") && !imageUrl.includes("localhost")) {
      setProfileImage(imageUrl); // Set Google profile picture
      return;
    }
  
    // If the image is stored locally in /uploads/profile_pictures/
    if (imageUrl.includes("/uploads/profile_pictures/")) {
      try {
        const response = await axios.get(
          `http://localhost:3000/profileSee/profile-picture/${imageUrl.split('/').pop()}`, 
          { responseType: "blob" }
        );
        const blobUrl = URL.createObjectURL(response.data);
        setProfileImage(blobUrl);
      } catch (error) {
        console.error("Error loading local profile image:", error);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userData) return <p className="text-center text-gray-600">User not found.</p>;

  const { user, posts } = userData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbaar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            alt="User DP"
            className="w-32 h-32 rounded-full border cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => setModalImage(profileImage)}
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.Name}</h2>
            <p className="text-gray-600">{user.Email}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-4 space-y-2">
          <p><strong>Name:</strong> {user.Name || "Not provided"}</p>
          <p><strong>Date of Birth:</strong> {user.Dob || "Not provided"}</p>
          <p><strong>Address:</strong> {user.Address || "Not provided"}</p>
          <p><strong>Phone:</strong> {user.Phone || "Not provided"}</p>
    
          <Rating userId={user._id} Email={user.Email}/>
        </div>

        {/* User Posts */}
        <h3 className="text-xl font-semibold mt-6">Posts by {user.Name}</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <img
                  src={profileImage || "https://via.placeholder.com/150"}
                  alt="User DP"
                  className="w-12 h-12 rounded-full"
                />
                <h4 className="font-semibold">{user.Name}</h4>
              </div>
              <p className="mt-2">{post.PostDescription}</p>
              {post.Media && (
                <img
                  src={post.Media}
                  alt="Post Media"
                  className="max-w-full h-48 object-contain rounded-md mt-2 cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => setModalImage(post.Media)}
                />
              )}
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-600">No posts available.</p>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-xl bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition"
              onClick={() => setModalImage(null)}
            >
              <FaTimes />
            </button>
            <img src={modalImage} alt="Full View" className="max-w-full max-h-screen rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
