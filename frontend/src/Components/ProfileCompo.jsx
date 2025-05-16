import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileDetails from './ProfileDisplayUser';
import ProfilePicture from './ProfilePictureUser';
import ProfileActions from './ProfileActionsUser';
import Menu_items from './Menu_items';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/solid';
import UserPosts from './UserProfileAllPosts';
import Navbaar from './Navbaar';
import Rating from "./Rating";
import PostEditRough from './PostEditRough';

function ProfileCompo() {
    const navigate = useNavigate();
    const { email } = useParams();

    const [profile, setProfile] = useState({
        Name: '',
        Email: '',
        Dob: '',
        Dp: '',
        Phone: '',
        Address: '',
        Skills: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalImage, setModalImage] = useState(null); // ✅ Fixed missing state

    const fetchProfileDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return console.error('User is not logged in.');

            const response = await axios.get('http://localhost:3000/profile/create', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { Name, Email, Dob, Dp, Phone, Address, Skills,_id } = response.data;

            setProfile({
                Name: Name || 'Anonymous',
                Email: Email || '',
                Dob: Dob ? Dob.split('T')[0] : '',
                Dp: Dp ? `http://localhost:3000${Dp}` : '/default-profile.png',
                Phone: Phone || '',
                Address: Address || '',
                Skills: Skills || '',
                _id: _id || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        }
    };

    useEffect(() => {
        fetchProfileDetails();
    }, []);

    useEffect(() => {
        if (email) fetchProfileDetails();
    }, [email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProfile((prevProfile) => ({
                ...prevProfile,
                Dp: URL.createObjectURL(file),
            }));
        }
    };

    const updateProfileAndPicture = async () => {
        try {
            await axios.put('http://localhost:3000/profile/update', {
                Name: profile.Name,
                Dob: profile.Dob,
                Address: profile.Address,
                Skills: profile.Skills,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (selectedFile) {
                const formData = new FormData();
                formData.append('profilePicture', selectedFile);
                await axios.put('http://localhost:3000/user/dp/upload', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
                });
            }

            fetchProfileDetails();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        if (!profile.Dp || profile.Dp.startsWith('blob:')) return;
        fetch(profile.Dp, { mode: 'cors' })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then((blob) => {
                const objectURL = URL.createObjectURL(blob);
                setProfile((prevProfile) => ({ ...prevProfile, Dp: objectURL }));
            })
            .catch((error) => console.error('Error fetching image:', error));
    }, [profile.Dp]);

    return (
        <>
            <Navbaar />
            <div className="w-full min-h-screen bg-gradient-to-br from-[#142d47] to-[#1e3a5f] text-white flex flex-col items-center px-6 py-12">
                <div className="max-w-6xl w-full bg-white text-gray-900 shadow-2xl rounded-3xl p-8 sm:p-12 transform transition-all hover:scale-105">
                    <div className="flex flex-col items-center space-y-8">
                        <ProfilePicture profile={profile} isEditing={isEditing} handleFileChange={handleFileChange} />

                        <ProfileDetails profile={profile} isEditing={isEditing} handleChange={handleChange} />

                        <ProfileActions isEditing={isEditing} setIsEditing={setIsEditing} updateProfileAndPicture={updateProfileAndPicture} />

                        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                            <p className="text-lg font-semibold">
                                <strong>Phone:</strong> {profile.Phone || 'Not Available'}
                            </p>
                            <button
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                                onClick={() => navigate('/update-phone', { state: { email: profile.Email } })}
                            >
                                <PencilIcon className="w-6 h-6" />
                                <span className="font-medium">Edit</span>
                            </button>
                        </div>

                        <div className="w-full">
    <UserPosts email={email} setModalImage={setModalImage} />
</div>

                        {/* ✅ Updated UserPosts with modalImage */}
                        {/* <UserPosts email={email} setModalImage={setModalImage} /> */}



{console.log("Profile Email:", email)}
{console.log(profile._id)}
{console.log(profile)}

      {/* <PostEditRough/> */}
                        <Rating userId={profile._id} email={profile.Email} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileCompo;
