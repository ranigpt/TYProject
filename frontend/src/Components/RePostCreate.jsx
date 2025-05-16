import React, { useState } from 'react';
import { FaCamera, FaMicrophone, FaStop, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const RecuiterPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [salary, setSalary] = useState('');
  const [hours, setHours] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [jobType, setJobType] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [customJobType, setCustomJobType] = useState('');
  const [customJobCategory, setCustomJobCategory] = useState('');
  const [jobLink, setJobLink] = useState('');

  const [recognition, setRecognition] = useState(null);

  const [loading, setLoading] = useState(false); // Add loading state

  const jobCategories = ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Construction Worker', 'Other'];
  const jobTypes = ['Full Time', 'Part Time', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const startVoiceInput = (setter) => {
    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.lang = language;
    speechRecognition.continuous = true;
    speechRecognition.start();
    setRecognition(speechRecognition);

    speechRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      setter((prev) => prev + transcript);
    };
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('experience', experience);
    formData.append('jobLink', jobLink);
    formData.append('salary', salary);
    formData.append('jobType', jobType === 'Full Time' || jobType === 'Other' || jobType === 'Part Time' ? customJobType : jobType);
    formData.append('jobCategory', jobCategory === 'Other' ? customJobCategory : jobCategory);
    if (image) formData.append('image', image);
    formData.append('skills', JSON.stringify(skills)); 

try {
      const Token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/Reapi/recuiterpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Token}`,  // Include the token
        },
      });
      

      //console.log('Response:', response);
      toast.success('Post created successfully!',{ autoClose: 2000 });

  // Reset the form fields
  setTitle('');
  setDescription('');
  setLocation('');
  setExperience('');
  setSkills('');
  setSalary('');
  setHours('');
  setImage(null);
  setPreview(null);
  setJobType('');
  setJobCategory('');
  setCustomJobType('');


    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create post.');
    }finally {
      setLoading(false); // Enable button after request completes
    }
    
  };

      

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Create a Job Post</h2>
      <Link to="/Employer" className="text-blue-500 block text-center mb-4">← Go back to Dashboard</Link>
      <form onSubmit={handleSubmit}>
        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Select Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="mr-IN">Marathi</option>
          </select>
        </div>

        {/* Job Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Job Title</label>
          <div className="flex items-center">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" required />
            <FaMicrophone className="ml-2 text-blue-500 cursor-pointer" onClick={() => startVoiceInput(setTitle)} />
            <FaStop className="ml-2 text-red-500 cursor-pointer" onClick={stopVoiceInput} />
          </div>
        </div>



        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <div className="flex items-center">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" rows="4" required />
            <FaMicrophone className="ml-2 text-blue-500 cursor-pointer" onClick={() => startVoiceInput(setDescription)} />
            <FaStop className="ml-2 text-red-500 cursor-pointer" onClick={stopVoiceInput} />
          </div>
        </div>


        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" required />
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label className="block text-gray-700">Salary</label>
          <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" required />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-gray-700">Skills Required</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" />
        </div>

        {/* Job category */}
        <div className="mb-4">
          <label className="block text-gray-700">Job Category</label>
          <select value={jobCategory} onChange={(e) => setJobCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" required>
            <option value="">Select Job Category</option>
            {jobCategories.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          {jobCategory === 'Other' && (
            <input type="text" placeholder="Specify job type" value={customJobCategory} onChange={(e) => setCustomJobCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" required />
          )}
        </div>

      {/* Experience */}
<div className="mb-4">
  <label className="block text-gray-700">Experience: {experience} years</label>
  <input 
    type="range" 
    min="0" 
    max="20" 
    step="1"
    value={experience} 
    onChange={(e) => setExperience(e.target.value)} 
    className="w-full px-4 py-2 border rounded-lg mt-2"
  />
</div>

   
    {/* Job Type */}
    <div className="mb-4">
          <label className="block text-gray-700">Job Type</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2">
            <option value="">Select Job Type</option>
            {jobTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          {(jobType === 'Full Time' || jobType === 'Part Time' || jobType === 'Other') && (
  <input type="text" placeholder="Specify the Timing" value={customJobType} onChange={(e) => setCustomJobType(e.target.value)} className="w-full px-4 py-2 border rounded-lg mt-2" />
)}

        </div>


        <div className="mb-4">
  <label className="block text-gray-700">Job Form Link :</label>
  <input
  type="url"
  name="jobLink"
  placeholder="Enter external job link (optional)"
  className="w-full px-4 py-2 border rounded-lg mt-2"
  value={jobLink} 
    onChange={(e) => setJobLink(e.target.value)} 
/>

</div>

        {/* Image Upload with Preview */}
        <div className="mb-4">
          <label className="block text-gray-700">Job Image</label>
          <div className="flex items-center mt-2">
            <input type="file" onChange={handleImageChange} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="flex items-center cursor-pointer text-white bg-blue-500 px-4 py-2 rounded-full">
              <FaCamera className="mr-2" /> Upload Image
            </label>
          </div>
          {preview && (
            <div className="relative mt-4">
              <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg shadow-md" />
              <FaTrash className="absolute top-0 right-0 text-red-500 cursor-pointer" onClick={removeImage} />
            </div>
          )}
        </div>

        {/* <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Post Job</button> */}
      
        <button 
  type="submit" 
  className={`w-full py-2 rounded-lg text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`} 
  disabled={loading}
>
  {loading ? 'Posting...' : 'Post Job'}
</button>

      
      </form>
    </div>
  );
};

export default RecuiterPost;
