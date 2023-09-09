const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allawedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allawedFields.includes(el)){
      newObj[el] = obj[el];
    }
  })
  return newObj;
}

exports.getAllUsers = catchAsync(async(req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users
    },
  });
});

//its update just the authenticated user
exports.updateMe = catchAsync(async(req, res, next)=> {
  // 1- Create an error if user posts password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('This route is not for password updates, Please use /updateMyPassword.', 400))
  }

  // 2- Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  
  // 3- update user Documents
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
  
});

exports.deleteMe = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: "Success",
    data: null,
  })
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = factory.deleteOne(User);

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
