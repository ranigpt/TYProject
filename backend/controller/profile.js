const User = require('../models/Register');

const profile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("user id", userId);

    const userProfile = await User.findById(userId).select('-Password'); // Exclude Password

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
console.log("userProfile", userProfile);
    res.status(200).json(userProfile);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = profile;
