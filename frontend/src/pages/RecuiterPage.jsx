import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import RecuiterDashboard1 from "../Components/RecuiterDashboard1";
import RecuiterPostDisplay from "../Components/RecuiterDisplay";
import CreatePost from "../Components/RePostCreate";
import ReNavbar from "../Components/ReNavbaar";

function RecuiterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <ReNavbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 min-h-screen bg-[#142d47] text-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Dashboard</h2>
          <RecuiterDashboard1 />
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Routes>
              {/* Route for displaying job posts */}
              <Route
                path="/"
                element={<RecuiterPostDisplay onCreatePost={() => navigate("/Employer/postCreate/create")} />}
              />

              {/* Route for creating a new post */}
              <Route path="postCreate/create" element={<CreatePost />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuiterPage;
