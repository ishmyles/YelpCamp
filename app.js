const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const campgroundSchema = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const AsyncWrap = require('./utilities/AsyncWrap');
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

const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    console.log(result.error)
    if (result.error) {
        throw new ExpressError(result.error, 400)
    } else {
        next();
    }
}

// ROUTES
app.get('/', async function (req, res) {
    res.render('index');
});

// GET Campgrounds
app.get('/campgrounds', AsyncWrap(async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// GET New Campground Form
app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

// POST New Campground
app.post('/campgrounds/new', validateCampground, AsyncWrap(async function (req, res) {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}));

// GET Campground by ID
// Ensure that anything that uses a similar path to this, needs to be above this route (as this catches all).
// As Express will scan the route from top to bottom, if routes that are similar to this end up below it & we access a route similar to this -
// Express will take the that param as an 'ID' that will be used to query the mongoDB for data & will result in an error.
app.get('/campgrounds/:id', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
}));

// DELETE Campground by ID
app.delete('/campgrounds/:id', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    await Campground.findByIdAndRemove(id)
    res.redirect('/campgrounds')
}));

// GET Edit Campground by ID
app.get('/campgrounds/:id/edit', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

// PUT Edit Campground
app.put('/campgrounds/:id/edit', validateCampground, AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const update = req.body.campground
    await Campground.findByIdAndUpdate(id, update);
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) =>
    next(new ExpressError('Page Not Found', 404))
)

app.use((err, req, res, next) => {
    if(err.name === 'ValidationError') err = new ExpressError("Incorrect Price", 400)
    next(err)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', {err})
})

app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`);
});