const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken;(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_IXPRESS_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);

  //Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body);
  //To get just the information i needed to the new user
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  console.log(user)
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  //createSendToken(user, 200, res);
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

//check if user logged in before get all tours
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in, Please log in to get access.', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The token of this user not exist.', 401));
  }
  // 4) Check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User changed password! Please log in again', 401));
  }

  //Grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to use's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}`

  try{
    await sendEmail({
    email: user.email,
    subject: 'Your password reset token',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email'
  })
  }catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email.'), 500);
  }
  
});
/*
exports.resetPassword = catchAsync(async(req, res, next) => {
    // 1- Get user based on the token(Encrypt token again and compare it with encrypted one in db)

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token) // :token in resetPassword Route
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2- Set password if token has not expired
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3- Update changedPasswordAt property for the user

    // 4- Log the user in, send JWT
    createSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //   status: 'success',
    //   token,
    // });
});
*/

exports.updatePassword = catchAsync(async(req, res, next) =>{
  // 1- Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2- Check if posted current password is correct
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    return next(new AppError('Your current password is wrong', 401))
  }
  // 3- If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req,body.passwordConfirm
  await user.save();
  // 4- Log user in, send JWT
  //createSendToken(user, 200, res);
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
})