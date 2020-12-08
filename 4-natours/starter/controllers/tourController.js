const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getDocuments(Tour);

exports.getTour = factory.getDocument(Tour, ['reviews']);

exports.addNewTour = factory.createDocument(Tour);

exports.updateTour = factory.updateDocument(Tour);

exports.deleteTour = factory.deleteDocument(Tour);

exports.updateRatingsAverage = catchAsync(async (req, res, next) => {
  const id = req.review.tour ? req.review.tour : req.body.tour;
  let statusCode = 200;
  if (req.reviewDelete) {
    req.review = null;
    statusCode = 204;
  }
  const tour = await Tour.findById(id).populate('reviews');
  const len = tour.reviews.length;
  let total = 0;
  tour.reviews.forEach((review) => {
    total += review.rating;
  });
  tour.ratingsAverage = total / len;
  tour.save();
  res.status(statusCode).json({
    status: 'success',
    data: req.review,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const statsQuery = Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);
  const stats = await statsQuery;
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const planQuery = Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);
  const plan = await planQuery;
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
