const tourController = require('./../controllers/tourController');
const express = require('express');

const tourRouter = express.Router();
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

// tourRouter.param('id', (req, res, next, val) => {
//     // val = value of id parameter
//     console.log(`tour id = ${val}`);
//     next();
// });
// tourRouter.param('id', tourController.checkID);

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMounthlyPlan);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

tourRouter
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = tourRouter;
