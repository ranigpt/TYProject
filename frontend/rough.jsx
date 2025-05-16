import React, { useState, useRef } from "react";
import axios from "axios";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

function PostCeation({ addNewPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB");
        return;
      }
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const clearImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const postbtn = async () => {
    if (!text) {
        toast.error("Post description cannot be empty");
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData(); // Correctly instantiate FormData
        formData.append("PostDescription", text);
        if (imageFile) formData.append("PostImage", imageFile);

        //const token = localStorage.getItem("token"); // Assuming you're using a token for authentication

        const response = await axios.post("http://localhost:3000/post/create", formData, {
            // headers: {
            //     "Content-Type": "multipart/form-data",
            //     Authorization: `Bearer ${token}`, // Include token if required
            // },
        });

        toast.success("Post Created Successfully");

        addNewPost(response.data.post); // Update parent component
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
    <div className="w-[45] bg-inherit h-56 rounded-md">
      <div className="w-full lg:w-[38rem] max-w-full bg-blue-200 rounded-md shadow-lg p-6 h-auto flex flex-col space-y-4 m-2 mt-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Create a post"
          className="w-full p-3 rounded-md bg-blue-200 border-none focus:outline-none resize-none overflow-hidden"
          rows={1}
        />
        {image && <img src={image} alt="Selected Preview" className="max-w-full h-auto rounded-md" />}
        <label className="flex items-center cursor-pointer text-blue-600">
          <FiImage className="text-3xl mr-2 hover:text-blue-800 transition-all duration-200" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <span className="text-gray-500 font-semibold">Add Image</span>
        </label>
        <button
          onClick={postbtn}
          disabled={loading}
          className={`w-full px-5 py-2 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white font-semibold rounded-md shadow-md hover:bg-blue-800 transition-all duration-300 focus:outline-none mb-1`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default PostCeation;
