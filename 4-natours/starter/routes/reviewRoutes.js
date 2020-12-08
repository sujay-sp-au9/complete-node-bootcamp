const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.setTourFilter, reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
    tourController.updateRatingsAverage
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.updateReview,
    tourController.updateRatingsAverage
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
