import React from 'react';

const ProfilePicture = ({ profile, isEditing, handleFileChange }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={profile.Dp}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
      />
      {isEditing && (
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-2 text-sm text-gray-500 file:border file:border-gray-300 file:rounded-md file:px-2 file:py-1 file:bg-gray-100 file:hover:bg-gray-200 transition"
        />
      )}
    </div>
  );
};




export default ProfilePicture;


// export default ProfilePicture;
