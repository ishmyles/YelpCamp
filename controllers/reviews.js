const Campground = require('../models/campground');
const Review = require('../models/review');

// POST New Campground Review
module.exports.createReview = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review has been posted!');
    res.redirect(`/campgrounds/${id}`);
};

// DELETE Camp Review by ID
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} }); // Pulls review from the Campground.reviews array & updates the Campground document
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted.');
    res.redirect(`/campgrounds/${id}`);
};