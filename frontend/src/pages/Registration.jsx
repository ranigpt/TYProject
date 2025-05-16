import React, { useState } from 'react';
import regisimage from "../assets/image1.png";
import bg1 from '../assets/bg1.png';
import human from '../assets/login.png';
import buttom from "../assets/image.png";
import { FaGoogle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginWIthGoogle from './LoginWIthGoogle';


function Registration() {

  const navigate = useNavigate();

  const [formdata , setFormdata] = useState({
    Name :'',
    Email :' ',
    Dob : '',
    Phone:'',
    Address:'',
    Password:'',
    Confirmpass : ''
  })


  // handle input changes

  const handleInputChanges =(e)=>{
    setFormdata({...formdata , [e.target.name]:e.target.value});
  }
 
  //

  const handleSubmit = async(e)=>{

    e.preventDefault()

    if(formdata.Password != formdata.Confirmpass){

      return toast.error('Password not matched !!');
    }
    console.log(formdata);
    try{

      const response = await axios.post('http://localhost:3000/register/reSignupurl', formdata);
      toast.success(response.data.msg);
      console.log("otp sent")
      //navigate('/login');
      navigate(`/verify-otp-user?email=${formdata.Email}`);

    }catch(e){
           
      const errormsg = e.response?.data?.errors?.[0]?.msg || "Registration Failed";
      toast.error(errormsg);
          console.log(e);
    }
  }

  return (
    <div className="h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bg1})` }}>
  <ToastContainer />
  <div className="flex flex-wrap md:flex-nowrap w-full md:w-[70%] max-h-screen overflow-auto rounded-lg shadow-lg bg-white p-6 hover:shadow-2xl transition-all duration-300">
    
    {/* Left Section */}
    <div className="flex flex-col items-center w-full md:w-1/2 p-4 border-r border-gray-300">
      <img src={regisimage} alt="Registration" className="w-full h-auto mb-4 rounded-lg" />
      <p className="text-center text-gray-600 font-semibold">"Welcome! Join us and take the first step toward new possibilities."</p>
      <img src={human} alt="blue-collar persons" className="w-48 md:w-56 rounded-md shadow-md mt-4 transition-transform duration-300 hover:scale-105" />
    </div>

    {/* Right Section (Form) */}
    <div className="flex flex-col items-center w-full md:w-1/2 px-4 py-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">Create Your Account</h1>
      <p className="text-center text-gray-600 font-semibold">"Unlock Opportunities, Build Your Future"</p>

      <LoginWIthGoogle />

      {/* Form Fields */}
      <div className="w-full flex flex-col items-center space-y-3 mt-3">
        <input type="text" name='Name' placeholder="Enter Your Name" value={formdata.Name} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="email" name='Email' placeholder="Enter Your Email" value={formdata.Email} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="date" name='Dob' placeholder="DOB" value={formdata.Dob} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="number" name='Phone' placeholder="Enter Your Phone Number" value={formdata.Phone} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="text" name='Address' placeholder="Enter Your Address" value={formdata.Address} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="password" name='Password' placeholder="Password" value={formdata.Password} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
        <input type="password" name='Confirmpass' placeholder="Confirm Password" value={formdata.Confirmpass} onChange={handleInputChanges} className="w-80 p-2 border border-gray-300 rounded-md focus:border-blue-500" />
      </div>

      {/* Submit Button */}
      <button type="submit" onClick={handleSubmit} className="w-80 p-3 mt-4 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-900 transition-all duration-300 focus:outline-none">
        Register
      </button>
    </div>
  </div>
</div>

  );
}

export default Registration;
