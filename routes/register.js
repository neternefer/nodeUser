const User = require('../models/user');
const express = require('express');
const router = express.Router();
//New user signup
router.get('/', (req, res) => {
    res.send('GET request for the register page');
});
router.post('/', async(req, res, next) => {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save((err, doc) => {
        if(!err){
            res.send(doc);
        }else{
            if(err.code === 11000){
                res.status(422).send('User already exists');
                
            }else{
                next(err)
            }
        }
    });
});

module.exports = router;