const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//Factory function that can return handlers functions

exports.deleteOne = Model => catchAsync(async(req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if(!document){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'Success',
        data: null,
    });
});

exports.updateOne = Model => catchAsync(async(req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
    if(!document){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'Success',
        data:{document},
    })
});

exports.createOne = Model => catchAsync(async(req, res, next) => {
    const document = await Model.create(req.body);
    if(!document){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(201).json({
        status: 'Success',
        data: {document}
    })
})

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const document = await query;
    
    if(!document){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(201).json({
      status: 'Success',
      data: { document },
    });
});

exports.getAll = Model => catchAsync(async(req, res, next) => {

    //To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

  //Execute query

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const documents = await features.query;

  //Send response
  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      documents,
    },
  });
})
