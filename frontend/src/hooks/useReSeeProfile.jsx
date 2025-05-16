import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams

const useReSeeProfile = () => {
  const { email } = useParams(); // Get email from URL
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecruiter = useCallback(async () => {
    console.log(email)
    if (!email) return; // Ensure email exists
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/recuiter/fetchpost/profile?email=${email}`);
      setRecruiter(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching recruiter data");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchRecruiter();
  }, [fetchRecruiter]);

  return { recruiter, loading, error, refetch: fetchRecruiter };
};

export default useReSeeProfile;
