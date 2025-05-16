const express = require('express');
const router = express.Router();
const RecuiterPostData = require('../models/RecuiterPostData');

router.post('/suggestions', async (req, res) => {
    console.log('Received Skills:', req.body.skills);
    try {
      const { skills } = req.body;
      if (!skills || !skills.length) {
        console.log('No skills provided');
        return res.status(400).json({ error: 'Skills are required' });
      }
      
      const skillRegex = skills.map(skill => new RegExp(skill, 'i'));

      const matchedJobs = await RecuiterPostData.find({
        $or: [
            { skills: { $in: skills } },
            { jobCategory: { $in: skills } },
            { title: { $in: skillRegex } },
            { description: { $in: skillRegex } }
        ]
    }).populate('RecuiterId', 'Name CompanyName'); // Populate recruiter's name
    
    console.log("Matched Jobs:", JSON.stringify(matchedJobs, null, 2));
      console.log('Matched Jobs:', matchedJobs);
      res.status(200).json(matchedJobs);
    } catch (error) {
      console.error('Error fetching job suggestions:', error);
      res.status(500).json({ error: 'Error fetching job suggestions' });
    }
  });
  
const User = require('../models/Register');
// Get user profile by ID
router.get('/:id', async (req, res) => {
    console.log('Request received for user ID:', req.params.id);
    try {
      const user = await User.findById(req.params.id).select('Skills');
      console.log('Fetched User:', user);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  });
  

module.exports = router;








