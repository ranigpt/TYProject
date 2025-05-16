import React, { useEffect, useState } from "react";
import { useSearchParams  } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbaar from "./Navbaar"; // Adjust the import path as necessary
import { toast } from "react-toastify";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  // Helper function to construct full media URL (if not from Cloudinary)
  const fullMediaUrl = (media) => {
    if (!media) return "";
    return media.startsWith("http") ? media : `http://localhost:3000/${media.replace(/^\//, "")}`;
  };

  // Fetch image as blob if it's a local path
  const fetchDpAsBlob = async (dpPath) => {
    try {
      const response = await fetch(`http://localhost:3000/${dpPath.replace(/^\//, "")}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching DP as blob:", error);
      return "/default-avatar.png";
    }
  };

  useEffect(() => {
    if (query) {
      axios
        .get(`http://localhost:3000/api/search?query=${query}`)
        .then(async (res) => {
          const uniqueResults = Array.from(
            new Map(res.data.map((item) => [item._id, item])).values()
          );

          // Fetch and update Dp as blob for local paths
          const updatedResults = await Promise.all(
            uniqueResults.map(async (item) => {
              let updatedDp = item.User_Id?.Dp;
              if (updatedDp && !updatedDp.startsWith("http")) {
                updatedDp = await fetchDpAsBlob(item.User_Id.Dp);
              } else if (updatedDp) {
                updatedDp = fullMediaUrl(updatedDp);
              }
              return { ...item, Media: fullMediaUrl(item.Media), User_Id: { ...item.User_Id, Dp: updatedDp } };
            })
          );

          console.log("Search Results:", updatedResults);
          setResults(updatedResults);
        })
        .catch((err) => console.error("Search error:", err));
    }
  }, [query]);

  return (
    <div className="p-5 min-h-screen bg-gradient-to-b from-[#fdfeff] to-[#eef3f7] text-[#130303]">
      <Navbaar />
      <h1 className="text-3xl font-bold mb-6 text-center animate-fade-in mt-7">Search Results for "{query}"</h1>
      <ul className="mt-4 max-w-4xl mx-auto">
        {results.length > 0 ? (
          results.map((item) => (
            <li
              key={item._id}
              className="p-6 bg-[#e1f5fe] rounded-xl shadow-lg mb-6 flex items-start transform transition-transform hover:scale-105 hover:shadow-xl"
            >
              {/* User Profile Section */}
              <Link to={`/user/profileSee/${item.User_Id?.Email}`} className="flex-shrink-0">
              <img
                src={item.User_Id?.Dp || "/default-avatar.png"}
                alt={item.User_Id?.Name || "User DP"}
                className="w-16 h-16 rounded-full mr-6 border-2 border-[#64b5f6] shadow-md"
              />
                </Link>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-[#0d47a1]">{item.User_Id?.Name || "Unknown User"}</h3>
                <p className="text-[#37474f]">{item.PostDescription}</p>

                {/* Display Media (Image/Video) */}
                {item.Media && (
                  <div className="mt-4">
                    {item.MediaType?.includes("image") ? (
                      <img
                        src={item.Media}
                        alt="Post Media"
                        className="w-full max-w-md rounded-lg shadow-md transition-opacity duration-500 ease-in-out"
                      />
                    ) : item.MediaType?.includes("video") ? (
                      <video
                        controls
                        src={item.Media}
                        className="w-full max-w-md rounded-lg shadow-md"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-[#546e7a] animate-pulse">No results found.</p>
        )}
      </ul>
    </div>
  );
}

export default SearchResults;