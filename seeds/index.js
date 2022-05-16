const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

// Connect to mongodb
mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to Database')
})

// Method that will randomly select one of the 'descriptors' & 'places' from seedHelpers each time it's called
const randomTitle = (arr) => arr[Math.floor(Math.random() * arr.length)];

// When called, it will delete all data within the yelpCamp database.
// The method will then loop to add/save new Campground data through the seedHelpers & cities files.
const seedData = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const review = new Review({
            author: '62811397debff6867153f5dc', // Need to change this if you recreate user db
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo architecto repudiandae debitis adipisci cupiditate pariatur rerum laudantium consequuntur!", 
            rating: 5
        });
        const newCamp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
            image: 'https://source.unsplash.com/collection/483251', // Randomizes tan image from the collection
            price: price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo architecto repudiandae debitis adipisci cupiditate pariatur rerum laudantium consequuntur, reprehenderit asperiores provident, omnis velit repellat eveniet laborum corrupti id sapiente dolorum.",
            author: '62811397debff6867153f5dc', // Need to change this if you recreate user db
            reviews: [review]
        });
        await newCamp.save();
        await review.save();
    }
    console.log('Data added to Database.')
};

// Run method, then close DB connection
seedData().then(() => db.close());