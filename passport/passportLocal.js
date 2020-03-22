const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    async(email, password, done) => {
        const user = await User.findOne({email: email});
        try{
            if(!user){
                console.log('User not found')
                return done(null, false, { message: 'User not found' });
            }else{
                if(await bcrypt.compare(password, user.password)){
                    return done(null, user);
                }
                   
            }
            console.log('Incorrect password')
            return done(null, false, { message: 'Incorrect credentials' });
            }
        catch (err) {
            return done(err)}
}));
passport.serializeUser((user, done) => {done(null, user.id)});
passport.deserializeUser(async(id, done) => {
    return done(null, User.findById(id));
});