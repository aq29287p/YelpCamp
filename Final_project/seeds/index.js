const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "6346b748c0a13fef3bcc0e99",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [ -118.242766, 34.053691 ] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dzn9iejgc/image/upload/v1665669962/YelpCamp/kxcy62uvetqevrs8jdba.jpg',
                    filename: 'YelpCamp/kxcy62uvetqevrs8jdba'

                },
                {
                    url: 'https://res.cloudinary.com/dzn9iejgc/image/upload/v1665669962/YelpCamp/dnzftu42zlqh8di5ifrg.jpg',
                    filename: 'YelpCamp/dnzftu42zlqh8di5ifrg'

                }
            ],
            price: Math.floor(Math.random() * 20) + 10,
            description: 'sample description'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})