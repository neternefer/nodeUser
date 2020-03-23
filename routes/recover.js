require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mailer = require('../nodemailer/mailer');

router.get('/', (req, res) => {
    res.send('GET request for the recover page');
});

router.post('/', async (req, res, next) => {
    try{
        const email = req.body.email;
        if(!email){
            throw new Error('Email can\'t be empty');
            
        }
        let user = await User.findOne({email: email});
        let text = "Dear Guest, we couldn't find your email address in our database.";
        if(!user){
            res.send('User not found');    
        }else{
            user.genResetToken();
            await user.save();
            let link = "http://" + req.headers.host + "/reset/" + user.resetToken;
            text = `Dear ${user.name}, please click this link: ${link}`;
            res.send('Reset email prepared');
        }
        mailer(email, text);
        next();
    }
    catch (err){
        next(err);
    }
});

module.exports = router;