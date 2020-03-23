require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mailer = require('../nodemailer/mailer');

router.get('/', (req, res) => {
    res.send('GET request for the reset psge');
});

router.get('/:token', (req, res) => {
    res.send('GET request to the reset page')
})
router.post('/:token', async (req, res, next) => {
    console.log('starting reset')
    try{
        const password = req.body.password;
        if(!password){
            throw new Error('Password can\'t be empty');
        }
        console.log(req.params)
        const user = await User.findOne(
            {resetToken: req.params.token});
        if(!user || user.resetTokenExp < Date.now()){
            res.status(401).send('Password reset token is invalid or has expired.');
        }
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        await user.save();
        text = `Dear ${user.name}, your password was successfully reset.`;
        mailer(user.email, text);
        res.status(200).send('Confirmation email sent');
    }
    catch (err){
        next(err);
    }
});

module.exports = router;