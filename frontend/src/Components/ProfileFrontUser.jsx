import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePicture from "./ProfilePictureUser";
import { useParams, Link } from "react-router-dom";
import UserRating from "./Rating";
import { FaUserCircle } from "react-icons/fa";
import useFetchProfile from "../hooks/useProfileFetch";

function ProfileFrontUser() {
  const { email } = useParams();

  const [profile, setProfile] = useState({
    Name: "",
    Email: "",
    Dob: "",
    Dp: "",
    Phone: "",
    Address: "",
    Skills: "",
  });

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("User is not logged in.");

      const response = await axios.get("http://localhost:3000/profile/create", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { _id, Name, Email, Dob, Dp, Phone, Address, Skills } = response.data;
      setProfile({
        _id: _id || "",
        Name: Name || "Anonymous",
        Email: Email || "",
        Dob: Dob ? Dob.split("T")[0] : "",
        Dp: Dp ? `http://localhost:3000${Dp}` : "/default-profile.png",
        Phone: Phone || "Not Available",
        Address: Address || "Not Provided",
        Skills: Skills || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  useEffect(() => {
    if (!profile.Dp || profile.Dp.startsWith("blob:")) return;

    fetch(profile.Dp, { mode: "cors" })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        setProfile((prevProfile) => ({ ...prevProfile, Dp: objectURL }));
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, [profile.Dp]);

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-[#142d47] to-[#1e3a5f] shadow-2xl rounded-3xl p-8 w-96 mx-auto text-white font-[Mooli] transform transition-all hover:scale-105">
      {/* Profile Picture */}
      <ProfilePicture profile={profile} />

      {/* Profile Info */}
      <div className="text-center mt-6">
        <h2 className="text-3xl font-bold tracking-wide mb-2">{profile.Name}</h2>
        <p className="text-gray-300 text-lg">{profile.Email}</p>
      </div>

      {/* Additional Details */}
      <div className="mt-6 w-full px-6">
        {[
          { label: "DOB", value: profile.Dob || "N/A" },
          { label: "Phone", value: profile.Phone },
          { label: "Address", value: profile.Address },
          { label: "Skills", value: profile.Skills },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-lg py-3 border-b border-gray-600"
          >
            <span className="font-semibold text-gray-300">{item.label}:</span>
            <span className="text-gray-100">{item.value}</span>
          </div>
        ))}

        {profile?.Email && (
          <Link
            to={`/user/profile/${profile.Email}`}
            className="mt-6 flex items-center justify-center space-x-2 text-lg font-medium text-yellow-400 hover:text-yellow-300 transition"
          >
            <FaUserCircle size={24} /> <span>Edit Profile</span>
          </Link>
        )}

        <div className="mt-6">
          <UserRating userId={profile._id} email={profile.Email} />
        </div>
      </div>
    </div>
  );
}

export default ProfileFrontUser;