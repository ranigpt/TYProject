import React, { useState } from 'react';
import regisimage from "../assets/image1.png";
import bg1 from '../assets/bg1.png';
import human from '../assets/login.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Registration() {
  const [formdata, setFormdata] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Dob: '',
    Password: '',
    Confirmpass: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const navigate = useNavigate();

  const handleInputChanges = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formdata.Password !== formdata.Confirmpass) {
      return toast.error("Passwords do not match!");
    }

    try {
      const response = await axios.post("http://localhost:3000/register/signupRecruiter", formdata);
      toast.success(response.data.msg);
      navigate(`/verify-otp?email=${formdata.Email}`);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration Failed";
      toast.error(errMsg);
    }
  };

  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg1})` }}>
      <ToastContainer />
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-row w-3/4 md:w-1/2 h-auto rounded-lg shadow-lg p-3 bg-white hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center w-96 p-0 bg-white border-r border-gray-300">
            <img src={regisimage} alt="Registration" className="w-full h-auto mb-4 rounded-lg" />
            <p className="text-center mb-4 text-gray-600 font-semibold">
              "Welcome! Join us and take the first step toward new possibilities."
            </p>
            <img src={human} alt="blue-collar persons" className="rounded-md shadow-md m-1 ml-10 object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="flex flex-col items-center w-full px-6 py-3 bg-white rounded-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Create Your Account</h1>
            <p className="text-center mb-2 text-gray-600 font-semibold">
              "Unlock Opportunities, Build Your Future"
            </p>
            <div className="flex flex-row mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-2 bg-slate-300 mx-1 rounded transition-colors duration-300 hover:bg-slate-400"></div>
              ))}
            </div>
            <input type="text" name='Name' placeholder="Enter Your Name" value={formdata.Name} onChange={handleInputChanges} className="w-80 h-auto p-2 rounded-sm m-2 border border-gray-300 transition duration-300 focus:border-blue-500" />
            <input type="email" name='Email' placeholder="Enter Your Email" value={formdata.Email} onChange={handleInputChanges} className="w-80 h-auto p-2 rounded-sm m-2 border border-gray-300 transition duration-300 focus:border-blue-500" />
            <input type="number" name='Phone' placeholder="Enter Your Phone Number" value={formdata.Phone} onChange={handleInputChanges} className="w-80 h-auto p-2 rounded-sm m-2 border border-gray-300 transition duration-300 focus:border-blue-500" />
            <input type="date" name='Dob' placeholder="DOB" value={formdata.Dob} onChange={handleInputChanges} className="w-80 h-auto p-2 rounded-sm m-2 border border-gray-300 transition duration-300 focus:border-blue-500" />
            
            <div className="relative w-80 m-2">
              <input 
                type={showPassword ? "text" : "password"} 
                name="Password" 
                placeholder="Password" 
                value={formdata.Password} 
                onChange={handleInputChanges} 
                className="w-full h-auto p-2 rounded-sm border border-gray-300 transition duration-300 focus:border-blue-500"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative w-80 m-2">
              <input 
                type={showConfirmPass ? "text" : "password"} 
                name="Confirmpass" 
                placeholder="Confirm Password" 
                value={formdata.Confirmpass} 
                onChange={handleInputChanges} 
                className="w-full h-auto p-2 rounded-sm border border-gray-300 transition duration-300 focus:border-blue-500"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" onClick={handleSubmit} className="p-3 mt-4 mb-2 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-900 transition-all duration-300 focus:outline-none">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
