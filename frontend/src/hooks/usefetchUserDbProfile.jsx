import { useState, useEffect } from "react";
import axios from "axios"; 

function useFetchUserDbProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/profileSee/AllDetails", {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the request
          }
        });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, loading, error };
}

export default useFetchUserDbProfile;
