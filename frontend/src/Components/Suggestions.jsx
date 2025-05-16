import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Suggestions() {
  const [userId, setUserId] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const fetchUserProfile = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:3000/api/jobs/${userId}`);
      const userSkills = response.data.Skills;
      setUserSkills(Array.isArray(userSkills) ? userSkills : userSkills.split(',').map(skill => skill.trim()));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchJobSuggestions = async () => {
    try {
      if (userSkills.length === 0) return;
      const response = await axios.post('http://localhost:3000/api/jobs/suggestions', { skills: userSkills });
      
      const updatedJobs = response.data.map(job => ({
        ...job,
        recruiterName: job.RecuiterId?.Name || 'Unknown' // ✅ Fetch recruiter's name
      }));
  
      setJobs(updatedJobs);
    } catch (error) {
      console.error('Error fetching job suggestions:', error);
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (userSkills.length > 0) {
      fetchJobSuggestions();
    }
  }, [userSkills]);

  return (
    <div className='hidden md:block md:w-72 lg:w-80 mt-5 m-3 ml-1 bg-gray-200 rounded-md p-2'>
      <h1 className='font-semibold text-2xl'>Jobs</h1>
      <h2 className='text-gray-600 m-1'>You may like these jobs</h2>

      {jobs.length === 0 ? (
        <p className='text-gray-500'>No jobs found matching your skills.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className='bg-white border border-blue-600 rounded-lg mb-2 p-2'>
            <Link to={`/jobs`} className='text-blue-600 hover:underline'>
            <h3 className='font-semibold'>{job.title}</h3>
            </Link>
            <p className='text-sm text-gray-700'>{job.description.split(' ').slice(0, 10).join(' ')}...</p>
            <p className='text-sm text-blue-600'>{job.location}</p>
            <p className='text-xs text-gray-500'>Posted by: {job.recruiterName}</p> {/* ✅ Show recruiter name */}
            </div>
        ))
      )}
    </div>
  );
}

export default Suggestions;
