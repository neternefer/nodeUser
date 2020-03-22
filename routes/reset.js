const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const User = require('../models/user');
const crypto = require('crypto');

router.get('/', (req, res) => {
    res.send('GET request for the reset psge');
});

router.post('/', async (req, res, next) => {
    try{
        const email = req.body.email;
        if(!email){
            throw new Error('Email can\'t be empty');
        }
        const user = await User.findOne({email: email});
        if(!user){
            res.send('User not found')
        }else{
            let token = crypto.randomBytes(20).toString();
            token = crypto.createHash('sha256').update('token').digest('hex');
            await user.updateOne({
                resetToken: token,
                resetTokenExp: Date.now() + 3600000
            });
            console.log(user.resetToken)
            res.send('Reset email prepared');
        }
    }
    catch (err){
        next(err);
    }
});

module.exports = router;