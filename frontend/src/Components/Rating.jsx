import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';

const Rating = ({ userId, email }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  //console.log("rating" , userId , email)
  useEffect(() => {
    // Fetch user's existing rating if available
    axios.get(`http://localhost:3000/rating/user/${userId}`)
      .then(response => {
        setRating(response.data.userRating || 0);
        setAverageRating(response.data.average || 0);
      })
      .catch(error => console.error('Error fetching rating:', error));
  }, [userId]);

  const handleRating = async (value) => {
    try {
      setRating(value); // Update UI immediately

      await axios.post('http://localhost:3000/rating/rate', { 
        userId, 
        email, 
        rating: value 
      });

      // Fetch updated average rating
      const response = await axios.get('http://localhost:3000/rating/average');
      setAverageRating(response.data.average || 0);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[#285f99] rounded shadow-md">
      <h3 className="text-lg font-bold mb-2 text-white">Rating</h3>
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <FiStar
              key={i}
              size={24}
              className={`cursor-pointer ${starValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(starValue)} // Assigning correct value
            />
          );
        })}
      </div>
      {/* <p className="mt-2">Your Rating: {rating}</p>
      <p>Average Rating: {averageRating.toFixed(1)}</p> */}
    </div>
  );
};

export default Rating;
