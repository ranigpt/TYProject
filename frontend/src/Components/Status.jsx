import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dummyImage from '../assets/dummy.png';

function Status() {
  const [profile, setProfile] = useState({
    Dp: '',
    Status: '',
  });

  const profileRef = useRef(null);

  // Handle profile field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Fetch profile details from the backend
  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in.');
        return;
      }

      const response = await axios.get('http://localhost:3000/profile/create', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { Dp, Status } = response.data;

      console.log(response.data);
      console.log(response.data.Dp);

      setProfile({
        Dp: Dp || dummyImage,
        Status: Status || 'Open to Work',
      });
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  // Update profile details in the backend
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { Name, Dob, Status } = profile; // Only include updatable fields
      const updatedData = { Name, Dob, Status };

      await axios.put('http://localhost:3000/profile/status', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Profile updated successfully');
      fetchProfileDetails(); // Refetch profile after update
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  // Update status and persist it
  const handleStatusChange = async (newStatus) => {
    setProfile((prevProfile) => ({ ...prevProfile, Status: newStatus }));
    await updateProfile(); // Call update immediately
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  return (
    <div
      ref={profileRef}
      className="hidden lg:flex w-72 h-auto bg-blue-100 rounded-md shadow-md flex-col m-3 p-3"
    >
      {/* Profile Header */}
      <div className="relative flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profile.Dp}
            alt="Profile"
            className="rounded-full w-20 h-20"
          />
          <input
            type="file"
            name="Dp"
            onChange={(e) =>
              setProfile((prevProfile) => ({
                ...prevProfile,
                Dp: URL.createObjectURL(e.target.files[0]),
              }))
            }
            onBlur={updateProfile} // Save on blur
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Current Status */}
        <h3 className="mt-4 text-lg font-semibold">Your Current Status</h3>
        <div className="flex flex-row m-2 mt-1 items-center text-center">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="status"
              value="Busy"
              onChange={() => handleStatusChange('Busy')}
              checked={profile.Status === 'Busy'}
              className="p-2 m-2"
            />
            <span>Busy</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="status"
              value="Open to Work"
              onChange={() => handleStatusChange('Open to Work')}
              checked={profile.Status === 'Open to Work'}
              className="p-2 m-2"
            />
            <span>Open to Work</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Status;
