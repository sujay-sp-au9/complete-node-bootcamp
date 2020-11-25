const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredError = 'A tour must have a ';

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `${requiredError} name`],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, `${requiredError} duration`],
    },
    maxGroupSize: {
      type: Number,
      required: [true, `${requiredError} group size`],
    },
    difficulty: {
      type: String,
      required: [true, `${requiredError} difficulty`],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, `${requiredError} price`],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, `${requiredError} summary`],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, `${requiredError} cover image`],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
