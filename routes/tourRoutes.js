const tourController = require('./../controllers/tourController');
const express = require('express');

const tourRouter = express.Router();

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

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
tourRouter.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = tourRouter;
