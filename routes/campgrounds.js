const express = require('express');
const Campground = require('../models/campground');
const AsyncWrap = require('../utilities/AsyncWrap');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utilities/ExpressError');
const router = express.Router();

const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    } else {
        next();
    }
}

// GET Campgrounds
router.get('/', AsyncWrap(async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// GET New Campground Form
router.get('/new', function (req, res) {
    res.render('campgrounds/new');
});

// POST New Campground
router.post('/new', validateCampground, AsyncWrap(async function (req, res) {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}));

// GET Campground by ID
// Ensure that anything that uses a similar path to this, needs to be above this route (as this catches all).
// As Express will scan the route from top to bottom, if routes that are similar to this end up below it & we access a route similar to this -
// Express will take the that param as an 'ID' that will be used to query the mongoDB for data & will result in an error.
router.get('/:id', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}));

// DELETE Campground by ID
router.delete('/:id', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// GET Edit Campground by ID
router.get('/:id/edit', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

// PUT Edit Campground
router.put('/:id/edit', validateCampground, AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const update = req.body.campground
    await Campground.findByIdAndUpdate(id, update);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;