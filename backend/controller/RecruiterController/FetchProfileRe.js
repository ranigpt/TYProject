const RecuiterProfile = require('../../models/ReRegister.model');

const fetchprofile = async (req, res) => {
    try {
        const reuser = await RecuiterProfile.find();
        res.json(reuser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = fetchprofile;
