const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgetPassword);
//userRouter.patch("/resetPassword/:token", authController.resetPassword); 

//This protect all routes after this middleware
userRouter.use(authController.protect);

userRouter.patch(
  '/updateMyPassword',
  authController.updatePassword
);

userRouter.get(
  '/me',
  userController.getMe,
  userController.getUser
);
userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(userController.getAllUsers).post(userController.createUser);
userRouter.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = userRouter;