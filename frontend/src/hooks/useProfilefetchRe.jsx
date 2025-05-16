import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPosts = () => {
  const [reuser, setReuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recuiter/recuiterProfile");
        setReuser(response.data.data);
        console.log(response.data);
      } catch (err) {
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { reuser};
};







export default useFetchPosts;
