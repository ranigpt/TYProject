import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProfile = () => {
  const [profile, setProfile] = useState({ Dp: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        console.log("Fetching profile details...");
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User is not logged in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/profile/create", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("navbaar", response.data);
        console.log("navbaar", response.data.Dp);

        if (response.data && response.data.Dp) {
          let imageUrl = response.data.Dp.startsWith("http")
            ? response.data.Dp
            : `http://localhost:3000${response.data.Dp}`;

          // Convert Image URL to Blob
          const blobResponse = await fetch(imageUrl);
          const blob = await blobResponse.blob();
          const blobUrl = URL.createObjectURL(blob);

          setProfile({ Dp: blobUrl });
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setError("Error fetching profile");
      }
    };

    fetchProfileDetails();
  }, []);

  return { profile, error };
};

export default useFetchProfile;
