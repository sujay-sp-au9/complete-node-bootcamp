const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.id) {
    filter.tour = req.params.id;
  }
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.author = req.user._id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
