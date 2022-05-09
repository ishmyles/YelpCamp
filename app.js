const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to Database')
})

const app = express(db);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async function (req, res) {
    res.render('index')
})

app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`)
})