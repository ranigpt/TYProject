import React, { useState, useRef } from "react";
import axios from "axios";
import { MdDelete, MdEdit, MdMic, MdStop } from "react-icons/md";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import Likes from "./Likes"
import Comments from './Comments'

const Shimmer = () => (
  <div className="animate-pulse bg-gray-300 rounded-full h-10 w-10"></div>
);
const PostDisplay = ({ posts, setPosts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [updateDescription, setUpdateDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("en"); // Default to English

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

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
        return;
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
             toast.error("Please Login to Create Post");
             return;
           }
    
           try {
      const response = await axios.put(
        `http://localhost:3000/post/update/${currentPost._id}`,
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data" ,
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
      console.log("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
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
  
  return (
    <div>
                     {console.log(posts)}
      { posts.map((post, index) => (
       <div
          key={post._id}
          className="p-6 rounded-md shadow-lg"
          style={{
            backgroundColor: backgroundColors[index % backgroundColors.length],
            marginBottom: "1rem",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {post.User_Id?.Dp ? (
                <img
                  src={post.User_Id.Dp}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  onLoad={(e) => e.target.style.display = 'block'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.error("Error loading image:", post.User_Id.Dp);
                  }}          
                />
              ) :(<Shimmer/>)}
              <h2 className="font-semibold text-gray-800">
                {post.User_Id?.Name || "Unknown User"}
              </h2>
            </div>
            <div className="flex space-x-3 text-gray-600">
             
              <button onClick={() => handleEdit(post)} className="hover:text-blue-600">
                <MdEdit size={20} />
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
                className="w-full border-none rounded-md p-2 focus:outline-none resize-none overflow-hidden"
              />
              {newImage ?  (
                <>
                <p>New Image</p>
                <img
                  src={newImage}
                  alt="Preview"
                  className="max-w-full h-48 object-contain rounded-md mt-2"
                />
                </>

              ) :(
                post.Media && (
                
                <>
                {/* <p>Current Image</p> */}
                <img
                  src={post.Media}
                  alt="Original Image"
                  className="max-w-full h-48 object-contain rounded-md mt-2"
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
          ) : (
            <>
              <p className="text-lg my-3 text-gray-700">{post.PostDescription}</p>
              {post.Media && (
                
                <img src={post.Media} alt="Post" className="w-32 h-auto rounded-md" />
                
              )}
               <div className="flex items-center justify-between mt-4">
                <div className="">
                <Likes postId={post._id} userId={post.User_Id} />
                </div>
                <Comments postId={post._id} />
              </div>



            </>
          )}
        </div>
      ))}
    </div>
  );
};
export default PostDisplay;
