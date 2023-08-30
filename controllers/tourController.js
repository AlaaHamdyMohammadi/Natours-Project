const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// 2) handlers

exports.getAllTours = catchAsync(async(req, res, next) => {
    console.log(req.query);

    //Execute query

    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    
    if(!tour){
      return next(new AppError('No tour found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      //results: tours.length,
      data: {
        tour,
      },
    });
});



exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try{
  //   // const newTour = new Tour({});
  //   // newTour.save().then();

  // }catch(err){
  //   res.status(400).json({
  //     status: 'Faild',
  //     message: 'Invalid data sent',
  //   })
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) { 
  return next(new AppError('No tour found with that ID', 404));
  }
  // 204 = No content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats =  catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: {_id: {$ne: 'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      },
    });
});

exports.getMounthlyPlan =  catchAsync(async(req, res, next) => {
    const year = req.params.year * 1; //2021

    const plan = await Tour.aggregate([
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
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        // 1=> accending, -1=> deaccending
        $sort: { numToursStarts: 1 },
      },
      {
        $limit: 12
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
});