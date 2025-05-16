import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPhoneAlt, FaKey } from "react-icons/fa";

function EnhancedLogin() {
  const [logindata, setLogindata] = useState({ Phone: "", Password: "" });
  const [useOTP, setUseOTP] = useState(false); // Toggle between OTP and Password login
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!logindata.Phone || (!logindata.Password && !useOTP)) {
      toast.error("Please fill all required fields!");
      return;
    }
  
    try {
      const endpoint = useOTP ? "/login/otp" : "/recruiter/login/password";
      console.log("Sending login request to:", endpoint, logindata);
  
      const response = await axios.post(`http://localhost:3000${endpoint}`, logindata);
  
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("recruiterUser", JSON.stringify(user));
  console.log("recuiter login token" ,token);
      toast.success("Login successful!");
      navigate("/Employer");
    } catch (error) {
      console.error("Login Error:", error); // Log full error details
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <video
        className="absolute w-full h-full object-cover"
        src="https://www.videvo.net/videvo_files/converted/2014_12/videos/keyboard_typing_dark_background.mp437836.mp4"
        autoPlay
        muted
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-black bg-opacity-75 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">
            Welcome to BlueSkillz!
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Showcase your skills and unlock your potential.
          </p>
          <div className="mb-4">
            <div className="relative">
              <FaPhoneAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="Phone"
                placeholder="Enter your phone number"
                value={logindata.Phone}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {!useOTP && (
            <div className="mb-4">
              <div className="relative">
                <FaKey className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  name="Password"
                  placeholder="Enter your password"
                  value={logindata.Password}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:opacity-90 transition duration-300"
          >
            {useOTP ? "Login with OTP" : "Login"}
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
            <span
              onClick={() => setUseOTP(!useOTP)}
              className="text-blue-500 cursor-pointer hover:underline mb-2 sm:mb-0"
            >
              {useOTP ? "Use Password Instead" : "Use OTP Instead"}
            </span>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <hr className="my-4" />
          <Link
            to="/Employer/Login"
            className="block text-center w-full p-3 bg-gray-100 text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            New User? Register Here
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EnhancedLogin;
