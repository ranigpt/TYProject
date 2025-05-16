import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useReProfilefetch = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecruiter = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode(token);
      const userphone = decodedToken?.Phone;
      if (!userphone) throw new Error("Invalid phone number in token");

      const response = await axios.get(`http://localhost:3000/ReProfile/${userphone}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecruiter(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching recruiter data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecruiter();
  }, [fetchRecruiter]);

  return { recruiter, loading, error, refetch: fetchRecruiter };
};

export default useReProfilefetch;
