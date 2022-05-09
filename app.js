const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const path = require('path');
const port = 3000;
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

// Connects to the mongodb:
// When the connection readyState is 'open', it will log you that the application is connected to the db.
// When an error occurs, it will log the error.
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to Database')
})

const app = express();

// Application Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ROUTES
app.get('/', async function (req, res) {
    res.render('index')
})


app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`)
})