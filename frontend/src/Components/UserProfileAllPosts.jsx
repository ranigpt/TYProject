import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit, MdMic, MdStop  , MdClose} from "react-icons/md";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import Likes from "./Likes"
import Comments from './Comments'
import useFetchProfile from "../hooks/useProfileFetch"; // Import correct hook

function UserPosts({ email }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [newImage, setNewImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [language, setLanguage] = useState("en"); // Default to English
  const [updateDescription, setUpdateDescription] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    if (!email) return;
   const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/profileSee/profile/${email}`
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching user posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [email]);

  const languages = {
    en: "en-US",
    hi: "hi-IN",
    mr: "mr-IN",
  };

const backgroundColors = ["#f9f4f4", "#f3f9f4", "#f4f4fa", "#f9f8f4", "#f4f9f9"]; // Array of light colors for posts.
const handleEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setUpdateDescription(post.PostDescription);
  };
const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB");
        return;
      }
      if (file.type.startsWith("image/")) {
        setNewImage(URL.createObjectURL(file));
        setNewImageFile(file);
      } else {
        toast.error("Invalid file type. Only images are allowed.");
      }
    }
  };
 const handleUpdate = async () => {
    if (!updateDescription.trim()) {
      toast.error("Post description cannot be empty");
      return;
    }
const formData = new FormData();
    formData.append("PostDescription", updateDescription);
    if (newImageFile) formData.append("Media", newImageFile);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to update post");
      return; }
try {
      const response = await axios.put(
        `http://localhost:3000/post/update/${currentPost._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
        }
      );
  if (response.status === 200) {
        const updatedPosts = posts.map((post) =>
          post._id === currentPost._id
            ? response.data.post : post
        );
  setPosts(updatedPosts);
        setIsEditing(false);
        setCurrentPost(null);
        setUpdateDescription("");
        //setNewImage(null);
        setNewImageFile(null);
        toast.success("Post updated successfully!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update post. Try again.";
      toast.error(errorMessage);
    }
  };
 const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to delete post");
      return;
    }
 try {
      await axios.delete(`http://localhost:3000/post/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete post.";
      toast.error(errorMessage);
    }
  };

   const startVoiceInput = () => {
      if (!("webkitSpeechRecognition" in window)) {
        toast.error("Speech Recognition is not supported in your browser.");
        return;
      }
   if (!recognitionRef.current) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languages[language];
        recognitionRef.current = recognition;
        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }
     if (transcript.trim()) {
            setUpdateDescription((prev) => prev + " " + transcript.trim());
          }
        };
       recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          toast.error("Error with voice input.");
        };
       recognition.onend = () => {
          setIsRecording(false);
        };
      }
   recognitionRef.current.lang = languages[language];
      recognitionRef.current.start();
      setIsRecording(true);
    };

    const stopVoiceInput = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    };

    const adjustTextAreaHeight = () => {
      if (textareaRef.current) {
        requestAnimationFrame(() => {
          textareaRef.current.style.height = "auto"; // reset height  first
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        });
      }
    };

    if (!Array.isArray(posts)) {
      return <p>Simmer.</p>;
    }
 if (loading) return <p className="text-center text-gray-300">Loading posts...</p>;
  if (posts.length === 0) return <p className="text-center text-gray-300">No posts available.</p>;
return (

  <div className="max-w-4xl mx-auto p-4">
  {console.log("all posts ",posts)}
{posts.map((post, index) => {

return (
<div
key={post._id}
className="p-6 rounded-md shadow-lg bg-white mb-6 transition-all hover:shadow-xl w-full min-w-[300px]"
>
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-4">
{console.log("User Email",post.User_Id?.Email)}
 
  

 </div>
    <div className="flex flex-row space-x-3 text-gray-600">
      <button onClick={() => handleDelete(post._id)} className="hover:text-red-600">
        <MdDelete size={22} />
      </button>
      <button onClick={() => handleEdit(post)} className="hover:text-blue-600">
        <MdEdit size={22} />
      </button>
    </div>
  </div>


  {isEditing && currentPost?._id === post._id ? (
  <div className="mt-4">
    <textarea
      ref={textareaRef}
      value={updateDescription}
      onInput={(e) => {
        setUpdateDescription(e.target.value);
        adjustTextAreaHeight();
      }}
      className="w-full flex-grow border rounded-md p-2 focus:outline-none resize-none min-h-[100px]"
      />
    {newImage ?  (
      <>
      <p>New Image</p>
      <div className="flex justify-center">
  <img
    src={newImage}
    alt="Preview"
    className="w-44 h-44 object-cover rounded-md mt-2"
  />
</div>
      {/* <img
        src={newImage}
        alt="Preview"
        className="max-w-[255] max-h-96 object-contain rounded-md mt-2"
      /> */}
      </>
) :(
      post.Media && (
     
      <>
      <p>Current Image</p>
      <img
        src={post.Media}
        alt="Original Image"
        className=" w-60 h-60 object-contain rounded-md mt-2"
        />
      </>
    )
    )}
    <label className="flex items-center mt-2 cursor-pointer text-blue-600">
      <FiImage className="text-2xl mr-2" />
      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      <span>Add New Image</span>
    </label>
    <div className="flex items-center space-x-2 mt-2">
      <button
        onClick={isRecording ? stopVoiceInput : startVoiceInput}
        className="text-blue-600"
      >
        {isRecording ? <MdStop size={24} /> : <MdMic size={24} />}
      </button>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
      </select>
    </div>
    <div className="flex space-x-4 mt-4">
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
):(
 
  <>
  <p className="text-lg my-3 text-gray-700">{post.PostDescription}</p>


  {post.Media && (
    <img
      src={post.Media}
      alt="Post"
      className=" w-36 rounded-md cursor-pointer "
      onClick={() => setSelectedImage(post.Media)}
    />
  )}
  <div className="flex items-center justify-between mt-4">
    <Likes postId={post._id} userId={post.User_Id} />
    <Comments postId={post._id} />
  </div>
</>
)}
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
   
)
}
 export default UserPosts;