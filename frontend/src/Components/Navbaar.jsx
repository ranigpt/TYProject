import React, { useEffect, useState } from "react";
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import useFetchProfile from "../hooks/useProfileFetch";
import Logo from "../assets/Logo.png";
import axios from "axios";

function Navbaar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { profile } = useFetchProfile();
  const [userData, setUserData] = useState(profile);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  useEffect(() => {
    if (profile?.Dp) {
      setUserData(profile);
    }
  }, [profile]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setSearchInput(!searchInput);

  const handleSearch = (event) => {
    event.preventDefault();
    if (inputVal.trim()) {
      navigate(`/search?query=${encodeURIComponent(inputVal)}`);
      setSearchInput(false); // Hide search box after submission
      setInputVal(""); // Clear input field
    }
  };
  
  

  const logOutHandler = () => {
    localStorage.removeItem("token");
    setUserData({});
    window.open("http://localhost:3000/logout", "_self");
  };

  return (
    <nav className="bg-[#142d47] text-white shadow-lg fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-6 py-2 h-[50px]">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="Logo" className="w-11 h-11 rounded-full border border-gray-400" />
          <h1 className="text-lg font-semibold tracking-wide">BlueSkillzz</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {/* Search Icon */}
          <div className="relative flex items-center space-x-2">
            <FaSearch className="text-lg cursor-pointer hover:text-gray-300 transition" onClick={toggleSearch} />
            {searchInput && (
             <form onSubmit={handleSearch} className="absolute top-full left-0 mt-2 flex items-center space-x-2 bg-white p-2 rounded-md shadow-lg">
             <input
               type="text"
               className="px-2 py-1 rounded bg-gray-200 text-black w-40 text-sm focus:outline-none"
               placeholder="Search..."
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
             />
             <button type="submit" className="px-3 py-1 bg-yellow-400 text-black rounded text-xs hover:bg-yellow-500 transition">
               Go
             </button>
           </form>
           
            )}
          </div>

          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/jobs" className="hover:text-yellow-400 transition">Jobs</Link>

          {userData?.Dp ? (
            <>
              <button onClick={logOutHandler} className="hover:text-yellow-400 flex items-center space-x-1 transition">
                <FaSignOutAlt /> <span>LogOut</span>
              </button>
              <Link to="/Registration">
                <img src={userData.Dp} alt="Profile" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-gray-400 shadow-md" />
              </Link>
            </>
          ) : (
            <Link to="/login" className="hover:text-yellow-400 transition flex items-center space-x-1">
              <FaUserCircle /> <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white focus:outline-none text-xl" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-center bg-[#1B263B] py-3 space-y-2 text-sm font-medium">
          <Link to="/" className="text-white py-1 hover:text-yellow-400 transition">Home</Link>
          <Link to="/jobs" className="text-white py-1 hover:text-yellow-400 transition">Jobs</Link>
          {userData?.Dp ? (
            <>
              <button onClick={logOutHandler} className="text-white py-1 hover:text-yellow-400 flex items-center space-x-1 transition">
                <FaSignOutAlt /> <span>LogOut</span>
              </button>
              <Link to="/Registration">
                <img src={userData.Dp} alt="Profile" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-gray-400 shadow-md mt-2" />
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-white py-1 hover:text-yellow-400 flex items-center space-x-1 transition">
              <FaUserCircle /> <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbaar;
