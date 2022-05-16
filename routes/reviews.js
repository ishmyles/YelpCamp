const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensures the params from the main app is also carried over to this req
const reviews = require('../controllers/reviews');
const AsyncWrap = require('../utilities/AsyncWrap');
const { loginRequired, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', loginRequired, validateReview, AsyncWrap(reviews.createReview))

router.delete('/:reviewId', loginRequired, isReviewAuthor, AsyncWrap(reviews.deleteReview))

module.exports = router;