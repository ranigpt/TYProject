import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import axios from "axios";
import loginimg from "../assets/loginimage.png";
import LoginWIthGoogle from "./LoginWIthGoogle";
import { Link } from "react-router-dom";

  function Login() {
  const [logindata, setLogindata] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  // Function to handle successful login
  const handleLoginSuccess = (userData) => {
    console.log("sucess login me " , userData)
    if(userData.token) {
   const check = localStorage.setItem("token", userData.token);
   
    localStorage.setItem("user", JSON.stringify(userData.user));
     // Store only email in localStorage
     localStorage.setItem("email", userData.user.email);
      // Debugging localStorage
      console.log("Token in localStorage:", localStorage.getItem("token"));
      console.log("User in localStorage:", localStorage.getItem("user"));
      console.log("Email in localStorage:", localStorage.getItem("email"));

  
    }
    setLogindata({}); // Clear the login form
    console.log("Redirecting to /");

    navigate("/" , {replace:true}); // Navigate to home page
  };

  // Update input fields
  const handleinput = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value });
  };

  // Handle manual login
  const handleLogin = async () => {
    if (!logindata.Email || !logindata.Password) {
      toast.error("Enter Email and Password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", logindata);

      if (response.data.token) {
       // toast.success(response.data.msg);
       console.log("login jsx checking respose = ",response.data)
       console.log("login jsx checking respose = ",response.data.user.email)
        handleLoginSuccess(response.data); // Use handleLoginSuccess on successful login
      } else {
        toast.error("Failed to login");
      }
    } catch (e) {
      const errormsg = e.response?.data?.errors?.[0]?.msg || "Login Failed";
      toast.error(errormsg);
    }
  };

  return (
    <div className="bg-blue-200 h-screen flex justify-center">
      <div className="mt-16 rounded-md shadow-lg p-2 bg-white flex-row h-[37rem] mb-2 md:h-[24rem]">
        <div className="m-2 p-2 bg-slate-300 rounded-sm shadow-md w-80 md:w-full md:h-[24rem] sm:w-72 sm:h-8">
          <div className="flex flex-row flex-wrap">
            <img src={loginimg} alt="worker" className="w-40 m-2 rounded-md shadow-md hover:translate-x-2 ml-16 md:m-2" />
            <div>
              <h1 className="text-slate-800 font-semibold mt-4 ml-14 md:ml-5">
                Welcome back to BlueSkillz!
              </h1>
              <h1 className="text-slate-800 font-semibold mt-1 ml-14 md:ml-5">
                Let's unlock your potential and showcase your skills.
              </h1>
            </div>
          </div>
          <ToastContainer />
          <LoginWIthGoogle /> {/* Pass handleLoginSuccess */}
          <hr className="bg-blue-950 text-blue-950"></hr>
          <input
            type="text"
            placeholder="Email"
            name="Email"
            value={logindata.Email}
            onChange={handleinput}
            className="w-52 rounded-sm m-4 p-1"
          />
          <input
            type="password"
            placeholder="Password"
            name="Password"
            value={logindata.Password}
            onChange={handleinput}
            className="w-52 rounded-sm m-4 p-1"
          />
          <button
            onClick={handleLogin}
            className="m-4 p-2 bg-blue-950 rounded-md shadow-md text-white w-24 font-semibold hover:cursor-pointer hover:bg-blue-600"
          >
            Login
          </button>
          <div>
          <Link to="/register" className="m-4 p-2  text-pretty text-blue-600 w-24  hover:cursor-pointer hover:text-blue-900">Create Account: Register</Link>
          <Link to="/forget-password-user" className="m-4 p-2  text-pretty text-blue-600 w-24  hover:cursor-pointer hover:text-blue-900">Forget Password</Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;