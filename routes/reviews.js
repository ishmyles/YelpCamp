const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const AsyncWrap = require('../utilities/AsyncWrap');
const ExpressError = require('../utilities/ExpressError');
const { loginRequired, validateReview, isReviewAuthor } = require('../middleware');
const router = express.Router({ mergeParams: true }); // Ensures the params from the main app is also carried over to this req

// POST New Campground Review
router.post('/', loginRequired, validateReview, AsyncWrap(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review has been posted!');
    res.redirect(`/campgrounds/${id}`);
}))

// DELETE Camp Review by ID
router.delete('/:reviewId', loginRequired, isReviewAuthor, AsyncWrap(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} }); // Pulls review from the Campground.reviews array & updates the Campground document
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted.');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;