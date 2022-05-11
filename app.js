const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const path = require('path');
const port = 3000;
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

// Connects to the mongodb:
// When the connection readyState is 'open', it will log that the application is connected to the db.
// When an error occurs, it will log the error.
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to Database');
})

const app = express();

// Use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// Application Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mounting Express Middleware
//app.use(express.json()) // for parsing application/json
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')) // override methods using query string value

// ROUTES
app.get('/', async function (req, res) {
    res.render('index');
});

// GET Campgrounds
app.get('/campgrounds', async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

// GET New Campground Form
app.get('/campgrounds/new', async function (req, res) {
    res.render('campgrounds/new');
});

// POST New Campground
app.post('/campgrounds/new', async function (req, res) {
    const body = req.body.campground;
    const newCampground = new Campground(body);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
});

// GET Campground by ID
// Ensure that anything that uses a similar path to this, needs to be above this route (as this catches all).
// As Express will scan the route from top to bottom, if routes that are similar to this end up below it & we access a route similar to this -
// Express will take the that param as an 'ID' that will be used to query the mongoDB for data & will result in an error.
app.get('/campgrounds/:id', async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
});

// DELETE Campground by ID
app.delete('/campgrounds/:id', async function (req, res) {
    const id = req.params.id;
    await Campground.findByIdAndRemove(id)
    res.redirect('/campgrounds')
})

// GET Edit Campground by ID
app.get('/campgrounds/:id/edit', async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
});

// PUT Edit Campground
app.put('/campgrounds/:id/edit', async function (req, res) {
    const id = req.params.id;
    const update = req.body.campground
    await Campground.findByIdAndUpdate(id, update);
    res.redirect(`/campgrounds/${id}`);
});


app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`);
});