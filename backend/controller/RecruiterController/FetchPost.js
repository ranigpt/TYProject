const RecuiterPostData = require('../../models/RecuiterPostData');
const User = require('../../models/ReRegister.model'); // Import User model

const fetchpost = async (req, res) => {
    try {
        // Fetch posts and populate recruiter details from User model
        const posts = await RecuiterPostData.find({ RecuiterId: req.user.id })
        .populate('RecuiterId')
        .lean(); // Converts Mongoose documents to plain objects
            // .populate({
            //     path: 'RecuiterId',
            //     select: 'Name Email Dp' // Select only required fields
            // });
            //console.log("Fetched Posts bk:", posts);

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { fetchpost };



