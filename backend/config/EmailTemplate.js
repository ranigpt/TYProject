const nodemailer = require('nodemailer');
 
const SendEmailToUser = async(link , email) =>{

    const transport = nodemailer.createTransport({
        service : "gmail",
        host : "smtp.gmail.com",
        port : 465,
        auth : {
            user : process.env.Email,
            pass : process.env.Password
        }
    });

    const mailOptions = {
        from : process.env.Email,
        to : email,
        subject : "Verify your email",
        html : `Click <a href="${link}">here</a> to reset your password.`
    };


// transport.sendMail(mailOptions , (error , info)=>{

//     if(error){
//         return res.status(400).json({message:"Error sending mail"});
//     }
//     return res.status(200).json({message:"Email sent successfully"});
// }) ;

transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending mail:", error); // Log detailed error
        return;
    }
    console.log("Email sent successfully:", info.response);
});

//return transport.sendMail(mailOptions); // Returns a Promise
}

module.exports = SendEmailToUser;