const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calculateRatings = async function (tourId) {
  const results = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(results);
};

reviewSchema.post('save', function (next) {
  this.constructor.calculateRatings(this.tour);
  next();
});

reviewSchema.post(/^findByIdAndUpdate/, function (next) {
  this.constructor.calculateRatings(this.tour);
  next();
});

reviewSchema.post(/^findByIdAndDelete/, function (next) {
  this.constructor.calculateRatings(this.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
