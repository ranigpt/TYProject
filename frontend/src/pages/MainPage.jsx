import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Navbaar from "../Components/Navbaar";
import ProfileFrontComp from "../Components/ProfileFrontUser";
import Suggestions from "../Components/Suggestions";
import PostDisplay from "../Components/PostDisplay";
import axios from "axios";
import PostCreationVoice from "../Components/PostCreationVoice";

const socket = io("http://localhost:3000");

function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Added userId state: This will store the User_Id from the first post.


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/post/getAll");

        const sortedPosts = await Promise.all(
          response.data.posts.map(async (post) => {
            let dpUrl = post.User_Id?.Dp || "";

            if (dpUrl && !dpUrl.startsWith("http")) {
              dpUrl = `http://localhost:3000${dpUrl}`;

              try {
                // Convert Image URL to Blob
                const blobResponse = await fetch(dpUrl);
                const blob = await blobResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                dpUrl = blobUrl;
              } catch (blobError) {
                console.error("Error converting image to blob:", blobError);
              }
            }

            return { ...post, User_Id: { ...post.User_Id, Dp: dpUrl } };
          })
        );

        setPosts(sortedPosts);
        if (response.data.posts.length > 0) {
          setUserId(response.data.posts[0].User_Id?._id || null); // Extracted User ID: After fetching posts, it sets userId based on the first post's User_Id.
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); // ✅ Fix: setError hata diya, loading false kar diya
      }
    };

    fetchPosts();
  }, []);

  // Fetch posts on component mount & setup socket.io
  useEffect(() => {
    socket.connect(); // Explicitly establish the connection

    socket.on("new-post", (newPost) => {
      setPosts((prevPosts) => {
        if (!prevPosts.some((post) => post._id === newPost._id)) {
          return [newPost, ...prevPosts]; // ✅ Fix: New post ko correctly add kiya
        }
        return prevPosts;
      });
    });

    socket.on("update-post", (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    });

    socket.on("post-deleted", (deletedPostId) => {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedPostId));
    });

    return () => {
      socket.off("new-post");
      socket.off("update-post");
      socket.off("post-deleted");
    };
  }, []);

  return (
    <div>
      <div className="mb-5">
        {/* {console.log("mainpage" , posts.User_Id)} */}
      <Navbaar />
      </div>
      <div className="flex-row lg:flex space-x-4 p-4 mt-5">
        <div className="mt-9">
        <ProfileFrontComp />
        </div>
        <div className="mt-9 flex flex-col">
          {/* Pass setPosts as a prop to PostDisplay */}
          <PostCreationVoice addNewPost={(newPosts) => setPosts(newPosts)} />
            
            
          <PostDisplay posts={posts} setPosts={setPosts} loading={loading} />
          </div>
        <div className="mt-9">

        <Suggestions userId={userId} /> {/* Passed userId to Suggestions Component: Now, Suggestions receives userId as a prop. */}
        </div>
      
      </div>
    </div>
  );
}

export default MainPage;
