require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = function mailer(email, text){
    const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
    });
    const mailOptions = {
        from: 'service@example.com',
        to: email,
        subject: 'Your Password Reset Request',
        text: text
        //html: <h1>Hello</h1>
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err)
        }else{
            console.log(info);
            res.status(200).send('email sent')
        }
    });
};

