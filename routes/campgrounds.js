const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const AsyncWrap = require('../utilities/AsyncWrap');
const ExpressError = require('../utilities/ExpressError');
const { loginRequired, isCampAuthor, validateCampground } = require('../middleware');

// GET Campgrounds
router.get('/', AsyncWrap(async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// GET New Campground Form
router.get('/new', loginRequired, function (req, res) {
    res.render('campgrounds/new');
});

// POST New Campground
router.post('/new', loginRequired, validateCampground, AsyncWrap(async function (req, res) {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', `${newCampground.title} has been added!`);
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// GET Campground by ID
// Ensure that anything that uses a similar path to this, needs to be above this route (as this catches all).
// As Express will scan the route from top to bottom, if routes that are similar to this end up below it & we access a route similar to this -
// Express will take the that param as an 'ID' that will be used to query the mongoDB for data & will result in an error.
router.get('/:id', AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author'}})
        .populate('author');
    if (!campground) {
        req.flash('error', 'Sorry, this campground no longer exists!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}));

// DELETE Campground by ID
router.delete('/:id', loginRequired, isCampAuthor, AsyncWrap(async function (req, res) {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been deleted.');
    res.redirect('/campgrounds');
}));

// GET Edit Campground by ID
router.get('/:id/edit', loginRequired, isCampAuthor, AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, this campground no longer exists!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}));

// PUT Edit Campground
router.put('/:id/edit', loginRequired, isCampAuthor, validateCampground, AsyncWrap(async function (req, res) {
    const id = req.params.id;
    const update = req.body.campground
    await Campground.findByIdAndUpdate(id, update);
    req.flash('success', 'Campground has been updated.');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;