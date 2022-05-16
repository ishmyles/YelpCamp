const Campground = require('../models/campground');

// GET Campgrounds
module.exports.index = async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

// GET New Campground Form
module.exports.renderNewCampForm = function (req, res) {
    res.render('campgrounds/new');
};

// POST New Campground
module.exports.createNewCampground = async function (req, res) {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', `${newCampground.title} has been added!`);
    res.redirect(`/campgrounds/${newCampground._id}`);
};

// GET Campground by ID
module.exports.getCampground = async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author'}})
        .populate('author');
    if (!campground) {
        req.flash('error', 'Sorry, this campground no longer exists!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
};

// DELETE Campground by ID
module.exports.deleteCampground = async function (req, res) {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been deleted.');
    res.redirect('/campgrounds');
};

// GET Edit Campground by ID
module.exports.getUpdateCampForm = async function (req, res) {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, this campground no longer exists!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
};

// PUT Edit Campground
module.exports.updateCampground = async function (req, res) {
    const id = req.params.id;
    const update = req.body.campground
    await Campground.findByIdAndUpdate(id, update);
    req.flash('success', 'Campground has been updated.');
    res.redirect(`/campgrounds/${id}`);
};