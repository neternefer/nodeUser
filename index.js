require('dotenv').config();
require('./models/db');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const MongoStore = require('connect-mongo')(session);
const register = require('./routes/register');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use('/register', register);

app.get('/', (req, res) => {
    res.send('GET request to the main page');
});


app.get('/login', (req, res) => {
    res.send('GET request for the login page');
});
app.get('/reset', (req, res) => {
    res.send('GET request for the reset page');
});
app.use((err, req, res, next) => {
    if(err.name === "ValidationError"){
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});




app.listen(process.env.PORT || 3000, 
    () => console.log(`Connecting at port ${process.env.PORT}`));