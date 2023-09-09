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

