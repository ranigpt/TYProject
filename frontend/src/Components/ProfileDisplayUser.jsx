import React from 'react';

function ProfileDetails({ profile, isEditing, handleChange }) {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8"> {/* ✅ Utilizes full space */}
            <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-800">Name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="Name"
                        value={profile.Name}
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <p className="text-lg">{profile.Name}</p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-800">Email:</label>
                <p className="text-lg">{profile.Email}</p>
            </div>

            <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-800">Date of Birth:</label>
                {isEditing ? (
                    <input
                        type="date"
                        name="Dob"
                        value={profile.Dob}
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <p className="text-lg">{profile.Dob || 'Not Available'}</p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-800">Address:</label>
                {isEditing ? (
                    <textarea
                        name="Address"
                        value={profile.Address}
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <p className="text-lg">{profile.Address || 'Not Available'}</p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-800">Skills:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="Skills"
                        value={profile.Skills}
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <p className="text-lg">{profile.Skills || 'Not Available'}</p>
                )}
            </div>
        </div>
    );
}

export default ProfileDetails;
