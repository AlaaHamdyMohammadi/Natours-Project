const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
        return next(AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'Success',
        data:{document},
    })
});

exports.createOne = Model => catchAsync(async(req, res, next) => {
    const document = await Model.create(req.body);
    if(!document){
        return next(AppError('No document found with that ID', 404));
    }
    res.status(201).json({
        status: 'Success',
        data: {document}
    })
})

