const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 250; i++)
  {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 40) + 10
    const camp = new Campground({
      author: '614cf3c0f6802e2a340eeeb2',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          _id: '614e276f13afbf1890c409b3',
          url: 'https://res.cloudinary.com/dskczv9qj/image/upload/v1632511844/YelpCamp/utfdbjoay3uelgge71ld.jpg',
          filename: 'YelpCamp/utfdbjoay3uelgge71ld'
        },
        {
          _id: '614e276f13afbf1890c409b4',
          url: 'https://res.cloudinary.com/dskczv9qj/image/upload/v1632511852/YelpCamp/pjdrbqkjjgsxtpxrb23k.jpg',
          filename: 'YelpCamp/pjdrbqkjjgsxtpxrb23k'
        },
        {
          _id: '614e276f13afbf1890c409b5',
          url: 'https://res.cloudinary.com/dskczv9qj/image/upload/v1632511855/YelpCamp/nkvpjsx9d1wpxxljvi1v.jpg',
          filename: 'YelpCamp/nkvpjsx9d1wpxxljvi1v'
        }

      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. At quas veniam fuga similique quam doloremque veritatis consectetur, fugiat ad, corrupti magnam officia ex dolor non exercitationem nesciunt, ut quo recusandae.',
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      }
    })
    await camp.save()
  }
}

seedDb().then(() => {
  mongoose.connection.close()
})
