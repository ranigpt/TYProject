const RecuiterPostData = require('../../models/RecuiterPostData');
const User = require('../../models/ReRegister.model'); // Import User model

const fetchProfileSee = async (req, res) => {
    try {
        const { email } = req.query;
        //console.log("Received email in backend:", email);
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const recruiter = await User.findOne({ Email: email }).lean();
        console.log("Found recruiter:", recruiter);

        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        const posts = await RecuiterPostData.find({ RecuiterId: recruiter._id })
            .populate('RecuiterId')
            .lean(); 

        //console.log("Fetched Posts:", posts);
        res.json(recruiter); // Send recruiter data instead of posts

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { fetchProfileSee };
