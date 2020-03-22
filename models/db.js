require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URI}`,
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})
    .then(() => console.log('Connecting...'))
    .catch((err) => console.log('Connection error: ', err));
