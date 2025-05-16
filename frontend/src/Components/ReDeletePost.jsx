import React from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

// function ReDeletePost({ postId, setPosts, posts }) { 


// const handleDelete = async () => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       toast.error("Please Login to Delete Post");
//       return;
//     }
  
//     try {
//       const response = await axios.delete(
//         `http://localhost:3000/Reapi/recuiterpostDelete/${postId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       console.log("Delete Response:", response); // Debugging
  
//       if (response.status === 200) {
//         // ✅ Update posts state correctly using the latest state
//         setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  
//         toast.success("Post deleted successfully!");
//       } else {
//         toast.error("Failed to delete post. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error Deleting Post:", error); // Debugging
  
//       const errorMessage = error.response?.data?.message || "Failed to delete post. Please try again.";
//       toast.error(errorMessage);
//     }
//   };
  
//   return (
//     <button onClick={handleDelete} className="hover:text-red-600">
//       <MdDelete size={22} />
//     </button>
//   );
// }

function ReDeletePost({ postId, setPosts , posts }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login to Delete Post");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/Reapi/recuiterpostDelete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully!");
      } else {
        toast.error("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error Deleting Post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <button onClick={handleDelete} className="hover:text-red-600">
      <MdDelete size={22} />
    </button>
  );
}




export default ReDeletePost;
