const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.route('/stats-tour').get(tourController.getTourStats);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'leadguide'),
    tourController.deleteTour
  );

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addNewTour);

module.exports = router;
