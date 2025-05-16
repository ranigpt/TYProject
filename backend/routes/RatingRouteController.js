const express = require('express');
const Rating = require('../models/RatingUser');

const router = express.Router();

// ⭐ 1. Get User's Rating and Average Rating
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get the user's rating
    const userRatingDoc = await Rating.findOne({ userId });
    const userRating = userRatingDoc ? userRatingDoc.rating : 0;

    // Calculate average rating
    const allRatings = await Rating.find();
    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const average = totalRatings > 0 ? sumRatings / totalRatings : 0;

    res.json({ userRating, average });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user rating' });
  }
});

// ⭐ 2. Submit or Update a Rating
router.post('/rate', async (req, res) => {
  try {
    const { userId, email, rating } = req.body;

    // Check if user already rated
    const existingRating = await Rating.findOne({ userId });

    if (existingRating) {
      existingRating.rating = rating; // Update rating
      await existingRating.save();
    } else {
      const newRating = new Rating({ userId, email, rating });
      await newRating.save();
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting rating' });
  }
});

// ⭐ 3. Get Average Rating for All Users
router.get('/average', async (req, res) => {
  try {
    const allRatings = await Rating.find();
    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const average = totalRatings > 0 ? sumRatings / totalRatings : 0;

    res.json({ average });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching average rating' });
  }
});

module.exports = router;
