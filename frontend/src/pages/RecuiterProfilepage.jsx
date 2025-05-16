import React, { useState, useEffect } from "react";
import { Settings, X, Pencil, Check } from "lucide-react";
import useReProfilefetch from "../hooks/useReProfileFetch";
import RecruiterInformation from "../Components/RecuiterInformation";
import axios from "axios";
import { toast } from "react-toastify";
import ReNavbaar from '../Components/ReNavbaar'

function RecruiterDashboard1() {
  const { recruiter, loading, error, refetch } = useReProfilefetch();
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [dp, setDp] = useState("");
  const [loadingImage, setLoadingImage] = useState(true); // Track image loading state

  useEffect(() => {
    if (recruiter) {
      setName(recruiter.Name || "");
      setDp(recruiter.Dp || "");
    }
  }, [recruiter]);

  // Fetch image as a blob to avoid CORS issues
  useEffect(() => {
    if (dp) {
      setLoadingImage(true);
      fetch(`http://localhost:3000${dp}`, {
        credentials: "include", // Ensure cookies and authentication tokens are sent
      })
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setDp(objectURL);
          setLoadingImage(false);
        })
        .catch((err) => {
          console.error("Error fetching profile image:", err);
          setLoadingImage(false);
        });
    }
  }, [dp]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/ReUpdateName/updateName/${recruiter.Phone}`,
        { Name: name },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully 🎉");
      setEditMode(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update profile ❌");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("Dp", file);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:3000/ReUpdateName/updateDp/${recruiter.Phone}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Profile picture updated successfully 🎉");
        setDp(response.data.recruiter.Dp);
        refetch();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update profile picture ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <ReNavbaar/>
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recruiter Dashboard</h2>

        <div className="flex space-x-2">
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? <X size={24} /> : <Settings size={24} />}
          </button>
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="text-center">
        <div className="relative inline-block">
          {loadingImage ? (
            <div className="w-20 h-20 bg-gray-300 animate-pulse rounded-full mb-2"></div>
          ) : (
            <img
              src={
                dp ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
          <label
            htmlFor="fileInput"
            className="absolute bottom-1 right-1 bg-gray-200 rounded-full p-1 cursor-pointer"
          >
            <Pencil size={16} />
          </label>
        </div>
      </div>

      {/* Name Edit Section */}
     {/* Name Edit Section */}
<div className="text-center mt-2">
  {editMode ? (
    <input
      type="text"
      className="border p-1 rounded text-center text-gray-800"  // <-- Added text-gray-800
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  ) : (
    <p className="text-gray-600 text-lg font-semibold">
      {name}
      <button className="ml-2 text-gray-500" onClick={() => setEditMode(true)}>
        <Pencil size={16} />
      </button>
    </p>
  )}
</div>


      {/* Save Changes Button */}
      {editMode && (
        <button className="w-full bg-green-500 text-white py-2 rounded-lg mt-4" onClick={handleUpdate}>
          <Check size={24} className="inline-block mr-2" />
          Save Changes
        </button>
      )}

      {!showSettings ? (
        <>
          <div className="mt-4 space-y-3">
            <div>Your All Posts</div>
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4" onClick={() => setShowSettings(true)}>
            Manage Profile
          </button>
        </>
      ) : (
        <div className="mt-4">
          <h1 className="text-lg font-semibold mb-2">Manage Your Profile</h1>
          <RecruiterInformation />
        </div>
      )}
    </div>
    </>
  );
}

export default RecruiterDashboard1;
