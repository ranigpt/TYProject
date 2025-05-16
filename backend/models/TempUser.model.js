const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Dob: { type: String, required: true },
    Phone: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Address: { type: String,  },
    OTP: { type: Number, required: true },
    OTP_Expiry: { type: Date, required: true, default: Date.now, index: { expires: 600 } },  // Auto-delete after 10 mins

    Attempts: { type: Number, default: 0 },



});

module.exports = mongoose.model('TempUser', TempUserSchema);
