import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // Change from 300 to 120 (2 min)
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract phone and email from URL query parameters
  const phone = new URLSearchParams(location.search).get('phone');
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setResendDisabled(false); // Enable resend OTP when timer hits 0
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/verifyUser/user/verify-otp', { phone, email, otp });
      toast.success(response.data.msg);
      navigate('/login/Employee');
    } catch (error) {
      const errormsg = error.response?.data?.errors?.[0]?.msg || "OTP Verification Failed";
      toast.error(errormsg);
    }
  };

  // Handle Resend OTP
  const resendOTP = async () => {
    try {
      await axios.post('http://localhost:3000/verifyRecuiter/register/resend-otp', {Phone: phone, Email:email });
      toast.success("New OTP sent!");
      setTimer(120);
      setResendDisabled(true);
    } catch (error) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        <p className="text-gray-600 mb-4 text-center">Enter OTP sent to <b>{phone || email}</b>:</p>
        <input
          type="text"
          value={otp}
          maxLength={6}
          pattern="\d*"
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-center"
          placeholder="Enter 6-digit OTP"
        />
        <p className="text-gray-500 text-center mb-4">
          Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </p>
        <button 
          onClick={handleSubmit} 
          disabled={otp.length !== 6} 
          className={`w-full p-2 rounded transition-all ${otp.length === 6 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
        >
          Verify OTP
        </button>
        {timer === 0 && (
          <button 
            onClick={resendOTP} 
            disabled={resendDisabled} 
            className={`w-full mt-2 p-2 rounded ${resendDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyOTP;
