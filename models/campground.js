const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: String,
    imageUrl: String
});

//TODO: Virtual Property for smaller images
ImageSchema.virtual('thumbnail').get(function() { return this.imageUrl.replace('upload/', 'upload/c_thumb,h_75,w_75/')});

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    reviews: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Review' 
        }
    ],
    image: [ImageSchema]
});

CampgroundSchema.virtual('mapPopup').get(function() { return `<a href="/campgrounds/${this._id}"><h6>${this.title}</h6></a><p>${this.location}</p>` });

// POST HOOK function to delete the reviews associated with the particular campground
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany(
            { 
                _id: {$in: doc.reviews} 
            }
        );
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);