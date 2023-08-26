const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


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

  // 2- update user Documents
  // const filteredBody = 
  // const updatedUser = await User.findByIdAndUpdate(req.user.id, test, {
  //   new: true,
  //   runValidators: true
  // })
  

  res.status(200).json({
    status: "success"
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
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
