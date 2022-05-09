const mongoose = require('mongoose');
const Campground = require('../models/campground');
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
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const newCamp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${randomTitle(descriptors)} ${randomTitle(places)}`
        })
        await newCamp.save();
    }
    console.log('Data added to Database.')
};

// Run method, then close DB connection
seedData().then(() => db.close());