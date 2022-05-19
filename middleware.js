const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require('./utilities/ExpressError');

// Validating model middleware
module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400)
    } else {
        next();
    }
};

// Authorization middleware
module.exports.loginRequired = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isCampAuthor = async (req, res, next) => {
    try {
        const id  = req.params.id;
        const camp = await Campground.findById(id);
        if (!camp) throw new ExpressError('Sorry, we cannot find this camp.', 400);
        if (!camp.author._id.equals(req.user._id)) {
            req.flash('error', 'You do not have permissions to perform this action');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const campId = await Campground.findById(req.params.id);
        if (!campId) throw new ExpressError('Unable to find camp.', '404');
        const id = req.params.reviewId;
        const review = await Review.findById(id).populate('author');
        if (!review) throw new ExpressError('Unable to find review.', '404');
        if (!review.author._id.equals(req.user._id)) {
            req.flash('error', 'You do not have permissions to perform this action');
            return res.redirect(`/campgrounds/${campId}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

// Adds the image links returned from multer.array to the req.body.campground.images
module.exports.addImageLinks = (req, res, next) => {
    const images = req.files.map(e => { return { filename: e.filename, imageUrl: e.path }});
    req.body.campground.image = images;
    next();
}

// This middleware is run before logging out. It handles when a user that hasn't been authenticated to never run the method users.logoutUser
module.exports.isUserAuthenticated = (req, res, next) => { return (!req.isAuthenticated()) ? res.redirect('/campgrounds') : next() }