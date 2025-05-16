import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function PhoneUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state
  const email = location.state?.email || ''; 

  const [phone, setPhone] = useState('');

  const handleSendOTP = async () => {
    console.log('Sending OTP to:', phone, email);
    try {
      await axios.post('http://localhost:3000/phone/send-otp', { phone, email });
      navigate('/verify-phone-otp-user', { state: { phone, email } });
    } catch (error) {
      console.error('Error sending OTP:', error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Phone Number</h2>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter new phone number"
        className="w-full border p-2 rounded mb-3"
      />
      <button onClick={handleSendOTP} className="w-full bg-blue-500 text-white py-2 rounded">
        Send OTP
      </button>
    </div>
  );
}

export default PhoneUpdatePage;
