const mongoose = require('mongoose');

const registerUser = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Dp: {
        type: String,
        Default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    },
    Email: {
        type: String,
        required: true,
        unique: true, // Optional: Ensure email uniqueness
    },
    Dob: {
        type: Date,
        required: function() {
            return !this.isGoogleUser;
        },
         // Allow null as a valid value
    },
    Phone :{
        type : Number,
        required : true,
    },
    Address :{
        type : String,
    },
    Skills :{
        type : String,
    },
    Status: {
        type: String,
    },
    Password: {
        type: String,
        validate: {
            validator: function(value) {
                // Password is required only if the user is not a Google user
                return this.isGoogleUser || (value && value.length > 0);
            },
            message: 'Password is required for manual registration.',
        },
    },
    isGoogleUser: {
        type: Boolean,
        default: false, // Default to manual users
    },
    verify: {
        type: Boolean,
        default: false, // Default to false until user verifies their email
    },
});

// Creating a pre-save hook to set isGoogleUser
registerUser.pre('save', function(next) {
    this.isGoogleUser = !this.Password;
    next();
});

// Model
const Userdata = mongoose.model('User', registerUser);

module.exports = Userdata;
