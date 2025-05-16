

// const sendOTP = async (phone, otp, carrier) => {
//     try {
//         // Telecom provider Email-to-SMS mappings
//         // const carrierEmailMap = {
//         //     "airtel": "@airtelmail.com",
//         //     "jio": "@jio.com",
//         //     "vodafone": "@vodafone.com",
//         //     "bsnl": "@bsnl.com"
//         // };

//         // // Validate carrier
//         // if (!carrierEmailMap[carrier]) {
//         //     throw new Error("Invalid carrier! Supported: airtel, jio, vodafone, bsnl");
//         // }

//         // // Convert phone number to Email-to-SMS format
//         const recipientEmail = `91${phone}${carrierEmailMap[carrier]}`;

//         // Create SMTP transporter
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.SMTP_EMAIL,
//                 pass: process.env.SMTP_PASSWORD
//             }
//         });

//         // Email details
//         const mailOptions = {
//             from: process.env.SMTP_EMAIL,
//             to: recipientEmail,
//             subject: "Your OTP Code",
//             text: `Your OTP is ${otp}. It will expire in 2 minutes.`
//         };

//         // Send mail
//         await transporter.sendMail(mailOptions);
//         console.log(`✅ OTP sent successfully to ${phone} via ${carrier}`);
//         return true;
//     } catch (error) {
//         console.error("❌ Error sending OTP:", error.message);
//         return false;
//     }
// };

const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTP = async (email, otp) => {
    try {
        // Create SMTP transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Email details
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,  // Directly send to the user's email
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 2 minutes.`
        };

        // Send mail
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
        return false;
    }
};

module.exports = sendOTP;


