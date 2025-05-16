import React, { useState, useEffect , useRef } from "react";
import axios from "axios";

export  function useRecuiterPost() {
    const [postdata, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from storage
                const response = await axios.get("http://localhost:3000/recuiter/fetchpost", {
                    headers: { Authorization: token }, // Send token in headers
                });
                
//console.log("Fetched Posts:", response.data);
               // console.log("Recuiter Post Data:", response.data);
                setPostData(response.data);

            } catch (err) {
                setError("Error fetching posts");
            } finally {
                setLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    return { postdata, loading, error };
}


  export function useRecuiterPostForList() {
    const [postdata, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const prevData = useRef([]); // Store previous data

    useEffect(() => {
        let isMounted = true; // Track component mounting
    
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/recuiter/fetchpost/joblist");
    
                if (isMounted && JSON.stringify(response.data) !== JSON.stringify(postdata)) {
                    setPostData(response.data);
                }
            } catch (err) {
                if (isMounted) setError("Error fetching posts");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
    
        fetchPosts();
    
        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted component
        };
    }, []); // Keep dependency array empty
    
    return { postdata, loading, error };
}


