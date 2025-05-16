import React from "react";
import { Link } from "react-router-dom";

function UserOrRecuiter() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Login as <span className="text-yellow-300">Employee</span> or <span className="text-green-300">Employer</span>
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-3xl px-4">
        {/* Employee Section */}
        <Link
          to="/login/Employee"
          className="flex flex-col items-center justify-center w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <div className="text-2xl font-semibold mb-2">Employee</div>
          <p className="text-sm text-center">
            Login to showcase your skills and connect with employers.
          </p>
        </Link>

        {/* Employer Section */}
        <Link
          to="/login/Employer"
          className="flex flex-col items-center justify-center w-full md:w-1/2 bg-green-600 hover:bg-green-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <div className="text-2xl font-semibold mb-2">Employer</div>
          <p className="text-sm text-center">
            Login to find talented employees for your organization.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default UserOrRecuiter;
