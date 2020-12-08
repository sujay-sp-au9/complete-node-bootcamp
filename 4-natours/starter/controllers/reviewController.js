const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setTourFilter = (req, res, next) => {
  if (req.params.id) {
    req.query.tour = req.params.id;
  }
  next();
};

exports.getReviews = factory.getDocuments(Review);

exports.getReview = factory.getDocument(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const doc = await Review.create(req.body);
  req.review = doc;
  next();
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  req.review = doc;
  next();
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  req.review = doc;
  req.reviewDelete = true;
  next();
});
