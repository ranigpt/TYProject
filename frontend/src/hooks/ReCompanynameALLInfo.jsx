import { useState, useEffect } from "react";
import axios from "axios";

const usefetchUpdatedInfoRe = (recruiterId) => {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch recruiter data
  const fetchRecruiterData = async () => {
    if (!recruiterId) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/recruiter/${recruiterId}`);
      setRecruiter(response.data);
    } catch (err) {
      setError("Failed to fetch recruiter data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchRecruiterData();
  }, [recruiterId]);

  return { recruiter, loading, error, refetch: fetchRecruiterData };
};

export default usefetchUpdatedInfoRe;
