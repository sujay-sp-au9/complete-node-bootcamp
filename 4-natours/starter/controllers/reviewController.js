const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

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

exports.updateReview = factory.updateDocument(Review);

exports.deleteReview = factory.deleteDocument(Review);
