const RecuiterPostData = require('../../models/RecuiterPostData');
const User = require('../../models/ReRegister.model'); // Import User model

const JobListFetch = async (req, res) => {
    try {
        const posts = await RecuiterPostData.find()
        .populate({
                path: 'RecuiterId',
                select: 'Name Email Dp' // Select only required fields
            });;
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { JobListFetch };
