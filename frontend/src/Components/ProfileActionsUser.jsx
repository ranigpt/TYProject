import React from 'react';

const ProfileActions = ({ isEditing, setIsEditing, updateProfileAndPicture }) => {
  return (
    <div className="flex justify-center mt-4">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Update
        </button>
      ) : (
        <button
          onClick={updateProfileAndPicture}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default ProfileActions;
