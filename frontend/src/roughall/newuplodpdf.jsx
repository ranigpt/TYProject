UploadFile.jsx

import React from "react";
import { Link } from "react-router-dom";

function UploadFile() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        File Upload: <span className="text-yellow-300">Upload PDF</span> or <span className="text-green-300">Upload from Software</span>
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-3xl">
        {/* PDF Upload Section */}
        <Link
          to="/upload/pdf"
          className="flex flex-col items-center justify-center w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <div className="text-2xl font-semibold mb-2">Upload PDF</div>
          <p className="text-sm text-center">Easily upload your PDF files for quick access.</p>
        </Link>

        {/* Software Upload Section */}
        <Link
          to="/upload/software"
          className="flex flex-col items-center justify-center w-full md:w-1/2 bg-green-600 hover:bg-green-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <div className="text-2xl font-semibold mb-2">Upload from Software</div>
          <p className="text-sm text-center">Import files directly from compatible software tools.</p>
        </Link>
      </div>
    </div>
  );
}

export default UploadFile;






