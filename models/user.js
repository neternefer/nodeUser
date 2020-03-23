const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:'Name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty'
    },
    resetToken: {
        type: String
    },
    resetTokenExp: {
        type: Date
    }
}, {timestamps: true});

userSchema.path('email').validate((val) => {
    emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(val);
}, 'Invalid email address format');

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            next();
        });
    });
});

userSchema.methods.genResetToken = function(){
    this.resetToken = crypto.randomBytes(20).toString('hex');
    this.resetTokenExp = Date.now() + 3600000;
}
mongoose.set('useFindAndModify', false);
module.exports = mongoose.model('User', userSchema);