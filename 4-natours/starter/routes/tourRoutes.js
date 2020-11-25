const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.route('/stats-tour').get(tourController.getTourStats);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addNewTour);

module.exports = router;
