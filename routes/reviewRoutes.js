const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const reviewRoute = express.Router({mergeParams: true});

reviewRoute
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

reviewRoute.route('/:id').delete(reviewController.deleteReview);  

module.exports = reviewRoute;
