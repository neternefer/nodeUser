require('dotenv').config();
require('./models/db');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const MongoStore = require('connect-mongo')(session);
const register = require('./routes/register');
const reset = require('./routes/reset');
const passport = require('passport');
const passportLocal = require('./passport/passportLocal');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session())
app.use('/register', register);
app.use('/reset', reset);


app.get('/', (req, res) => {
    res.send('GET request to the main page');
});

app.get('/login', (req, res) => {
    res.send('GET request for the login page');
});

app.post('/login', passport.authenticate('local',
    { 
        failureRedirect: '/login',
        successRedirect: '/'
    })
);

app.use((err, req, res, next) => {
    if(err.name === "ValidationError"){
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }else{
        res.status(422).send(err.message)
    }
});


app.listen(process.env.PORT || 3000, 
    () => console.log(`Connecting at port ${process.env.PORT}`));