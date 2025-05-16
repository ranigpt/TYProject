const { default: mongoose } = require("mongoose");
const { image } = require("../config/Cloudinary");

const RecuiterPost = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: String,
        
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        
    },
    jobLink: { type: String, required: false }, // New field for external job link

    skills: {
        type: Array,
        
    },
    salary: {
        type: Number,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    jobType: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
   
    RecuiterId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RecruiterData',
        required: true
    }
    
})

const RecuiterPostData = mongoose.model('RecuiterPostData', RecuiterPost);

module.exports = RecuiterPostData;