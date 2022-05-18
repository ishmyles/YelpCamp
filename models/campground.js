const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: String,
    imageUrl: String
});

//TODO: Virtual Property for smaller images

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
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

// POST HOOK function to delete the reviews associated with the particular campground
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany(
            { 
                _id: {$in: doc.reviews} 
            }
        );
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);