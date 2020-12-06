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
      maxlength: [40, 'A tour name must have less than 41 characters'],
      minlength: [10, 'A tour must have more 9 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
    },
    price: {
      type: Number,
      required: [true, `${requiredError} price`],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this is accessible when creating, but not when updating
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Type must be a Point',
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
            message: 'Type must be a Point',
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARE

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual POPULATE
toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//QUERY MIDDLEWARE

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query time:  + ${Date.now() - this.start} ms`);
  next();
});

// AGREGATE MIDDLEWARE

toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;

// POST /tour/id/reviews
