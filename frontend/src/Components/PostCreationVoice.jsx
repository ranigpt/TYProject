import React, { useState, useRef } from "react";
import { MdMic } from "react-icons/md";
import { FiImage } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const PostCreationVoice = ({ addNewPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("en"); // Default to English
  const recognitionRef = useRef(null);

  const languages = {
    en: "en-US",
    hi: "hi-IN",
    mr: "mr-IN",
  };

  const textareaRef = useRef(null);

  

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current.style.height = "auto"; // Reset height first
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
      });
    }
  };
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB");
        return;
      }

      if (file.type.startsWith("image/")) {
        setImage(URL.createObjectURL(file));
        setImageFile(file);
      } else if (file.type.startsWith("video/")) {
        setImage(null);
        setImageFile(file);
      } else {
        toast.error("Invalid file type. Only images and videos are allowed.");
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    setImageFile(null);
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
        let newTranscript = "";
        let lastResult = text;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim();
          if (event.results[i].isFinal) {
            if (!lastResult.endsWith(transcript)) {
              newTranscript += transcript + " ";
            }
            lastResult += transcript + " ";
          }
        }
        adjustTextareaHeight();


        setText((prevText) => prevText + newTranscript);
        adjustTextareaHeight();
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

  const postbtn = async () => {
    if (!text && !imageFile) {
      toast.error("Post description cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("PostDescription", text);
      if (imageFile) formData.append("Media", imageFile);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please Login to Create Post");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
        }
      );

      toast.success("Post Created Successfully");
      console.log("Post Created Successfully");
      addNewPost((prevPosts) => [response.data.post, ...prevPosts]);
      setText("");
      clearImage();
    } catch (error) {
      console.error(error);
      toast.error("Failed to Create Post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[45] bg-inherit h-auto rounded-md">
      <div className="w-full lg:w-[38rem] max-w-full bg-blue-200 rounded-md shadow-lg p-6 flex flex-col space-y-4 m-2 mt-3">
        

<textarea
  ref={textareaRef}
  value={text}
  onInput={(e) => {
    setText(e.target.value);
    adjustTextareaHeight();
  }}
  placeholder="Create a post"
  className="w-full p-3 rounded-md bg-blue-200 border-none focus:outline-none resize-none overflow-hidden"
  rows={1}
/>

        {image && (
          <img
            src={image}
            alt="Selected Preview"
            className="max-w-full h-48 object-contain rounded-md"
          />
        )}
        {imageFile && imageFile.type.startsWith("video/") && (
          <video controls className="w-full h-auto rounded-md">
            <source src={URL.createObjectURL(imageFile)} type={imageFile.type} />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer text-blue-600">
            <FiImage className="text-3xl mr-2 hover:text-blue-800 transition-all duration-200" />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-gray-500 font-semibold">Add Image</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-blue-100 rounded-md focus:outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
          <MdMic
            size={30}
            color="blue"
            className="cursor-pointer hover:text-blue-800 transition-all duration-200"
            onClick={isRecording ? stopVoiceInput : startVoiceInput}
          />
          {isRecording && (
            <button
              onClick={stopVoiceInput}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition-all duration-300"
            >
              Stop
            </button>
          )}
        </div>
        <button
          onClick={postbtn}
          disabled={loading}
          className={`w-full px-5 py-2 ${
            loading ? "bg-gray-400" : "bg-blue-600"
          } text-white font-semibold rounded-md shadow-md hover:bg-blue-800 transition-all duration-300 focus:outline-none`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostCreationVoice;
