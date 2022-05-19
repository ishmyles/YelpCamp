const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        image: Joi.array().items({filename: Joi.string(), imageUrl: Joi.string()}),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location : Joi.string().required()
    }).required(),
    deleteImgs: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
});