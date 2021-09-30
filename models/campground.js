const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dskczv9qj/image/upload/w_200/v1632511855/YelpCamp/nkvpjsx9d1wpxxljvi1v.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_300')
})



const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
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
  ]
})
  .set('toJSON', { virtuals: true });

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <br>${this.location}
  `
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground.reviews.length)
  {
    const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
  }
})

module.exports = mongoose.model("Campground", CampgroundSchema)