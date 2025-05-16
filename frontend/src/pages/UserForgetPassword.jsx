import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [contact, setContact] = useState("");
  const [method, setMethod] = useState("otp");
  const navigate = useNavigate();

  const handleRequest = async () => {
    if (!contact) {
      toast.error("Please enter your phone number!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/forget/forgetpassword", { contact, method });
      toast.success(response.data.msg);
      
      if (method === "otp") {
        navigate(`/forget-otp-verify-user?contact=${contact}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Request failed!");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <input
          type="text"
          placeholder="Enter your Phone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-3">
          <option value="otp">Receive OTP</option>
          {/* <option value="email">Send Reset Link</option> */}
        </select>
        <button onClick={handleRequest} className="w-full p-2 bg-blue-600 text-white rounded">
          Send Reset Details
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
