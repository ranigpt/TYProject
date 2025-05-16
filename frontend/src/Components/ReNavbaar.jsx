import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo.png";

function ReNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-[#142d47] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border border-gray-300" />
            <span className="text-xl font-semibold tracking-wide">BlueSkillzz</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/Employer" className="flex items-center hover:text-gray-300 transition duration-200">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/Employer/Profile" className="flex items-center hover:text-gray-300 transition duration-200">
              <FaUser className="mr-2" /> Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center hover:text-gray-300 transition duration-200"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden fixed inset-0 bg-[#142d47] bg-opacity-95 flex flex-col items-center justify-center space-y-6 transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <Link 
            to="/Employer" 
            className="text-lg flex items-center space-x-2 hover:text-gray-300 transition duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <FaHome /> <span>Home</span>
          </Link>
          <Link 
            to="/Employer/Profile" 
            className="text-lg flex items-center space-x-2 hover:text-gray-300 transition duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <FaUser /> <span>Profile</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-lg flex items-center space-x-2 hover:text-gray-300 transition duration-200"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
          <button
            className="absolute top-5 right-5 text-white p-2 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <FaTimes size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default ReNavbar;
