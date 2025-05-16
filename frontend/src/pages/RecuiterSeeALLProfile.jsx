import React, { useState, useEffect } from "react";
import RecruiterInformation from "../Components/RecuiterInformation";
import ReNavbaar from '../Components/ReNavbaar';
import useReSeeProfile from "../hooks/useReSeeProfile";

function RecruiterDashboard1() {
  const { recruiter, loading, error } = useReSeeProfile();
  const [name, setName] = useState("");
  const [dp, setDp] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (recruiter) {
      setName(recruiter.Name || "");
      setDp(recruiter.Dp || "");
      console.log(recruiter)
    }
  }, [recruiter]);

  useEffect(() => {
    if (dp) {
      setLoadingImage(true);
      fetch(`http://localhost:3000${dp}`, {
        credentials: "include",
      })
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setDp(objectURL);
          setLoadingImage(false);
        })
        .catch((err) => {
          console.error("Error fetching profile image:", err);
          setLoadingImage(false);
        });
    }
  }, [dp]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <ReNavbaar />
      <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto relative">
        <h2 className="text-xl font-bold text-center">Recruiter Dashboard</h2>

        <div className="text-center mt-2">
  {recruiter ? (
    <p className="text-gray-600 text-lg font-semibold">{recruiter.Name || "No Name Available"}</p>
  ) : (
    <p className="text-gray-600 text-lg font-semibold">Loading...</p>
  )}
</div>

{console.log(recruiter)}
        {/* Profile Image Section */}
        <div className="text-center mt-4">
          {loadingImage ? (
            <div className="w-20 h-20 bg-gray-300 animate-pulse rounded-full mb-2"></div>
          ) : (
            <img
              src={
                dp ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
        </div>

        

        <div className="mt-4">
          <div className="mt-4 space-y-3">
        <p><strong>Phone:</strong> {recruiter?.Phone || "N/A"}</p>
        <p><strong>Status:</strong> {recruiter?.Status || "N/A"}</p>
        <p><strong>Company:</strong> {recruiter?.CompanyName || "N/A"}</p>
        <p><strong>Designation:</strong> {recruiter?.Designation || "N/A"}</p>
        <p><strong>Industry:</strong> {recruiter?.Industry || "N/A"}</p>
        <p><strong>Experience:</strong> {recruiter?.Experience ? `${recruiter.Experience} years` : "N/A"}</p>
        <p><strong>Hiring Location:</strong> {recruiter?.HiringLocation || "N/A"}</p>
      </div>



        </div>
      </div>
    </>
  );
}

export default RecruiterDashboard1;
