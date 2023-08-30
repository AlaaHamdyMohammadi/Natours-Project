const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'Success',
        results: reviews.length,
        data: {reviews}
    });
});

// exports.getReview = catchAsync(async(req, res, next) => {
//     const review = await Review.findById(req.body);
//     res.status(200).json({
//       status: 'Success',
//       data: { review },
//     });
// });

exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: { review },
    });
});
 
// exports.updateReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });
//     res.status(200).json({
//       status: 'Success',
//       data: { review },
//     });
// });

// exports.deleteReview = catchAsync(async(req, res, next) => {
//     const review = await Review.findByIdAndDelete(req.params.id)
//     res.status(200).json({
//       status: 'Success',
//       data: null,
//     });
// });