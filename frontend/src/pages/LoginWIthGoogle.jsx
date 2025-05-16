import React, { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetchUserDbProfile from "../hooks/usefetchUserDbProfile"; // Import the hook

function LoginWIthGoogle() {
  const navigate = useNavigate();
    const { user, loading, error } = useFetchUserDbProfile();
  

  const handleSignIn = async () => {
    // Redirecting the user to the backend authentication route
    window.location.href = "http://localhost:3000/auth/google";
  };

  useEffect(() => {
    // Check for the token in the query parameters if redirect happened
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
     const userEmail = user?.Email;
    if (token) {
      localStorage.setItem("token", token);  // Store the token in localStorage
      console.log("Token stored:", token);
     console.log("google login Email store" , userEmail);
     localStorage.setItem("email" , userEmail)
      navigate("/");  // Redirect to the main page after login
    }
  }, [navigate]);



  
 
  







  return (
    <div className="flex items-center border border-black m-2 mb-4 p-2 bg-blue-500 w-72 h-10 rounded cursor-pointer transition-colors duration-300 hover:bg-blue-600 md:w-80">
      <FaGoogle className="text-blue-950 mr-4 text-xl" />
      <button onClick={handleSignIn}>
        <span className="text-lg font-semibold text-white">Sign up with Google</span>
      </button>
    </div>
  );
}

export default LoginWIthGoogle;
