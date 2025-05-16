// models/Rating.js
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const mongodb =  mongoose.model('Rating', RatingSchema);

module.exports = mongodb;