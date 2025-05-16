import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyOtpUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes = 180 seconds

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/phone/verify-otp", { email, otp, phone });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendDisabled(true);
      setTimer(180); // Reset timer to 3 minutes
      setError("");
      setMessage("Resending OTP...");
      toast.info("Sending new OTP...");

      await axios.post("http://localhost:3000/phone/send-otp", { email });

      toast.success("New OTP sent successfully!");
      setMessage("New OTP sent successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to resend OTP");
      toast.error(error.response?.data?.error || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full transition-transform duration-300 scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Enter OTP</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {message && <p className="text-green-500 text-center mb-3">{message}</p>}

        {/* OTP Input Field */}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border p-3 rounded-lg mb-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
              Verifying...
            </div>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={handleResendOTP}
          className={`w-full mt-3 py-3 rounded-lg text-lg font-semibold transition ${
            resendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>

        {/* Shimmer Effect while Verifying */}
        {loading && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyOtpUser;
