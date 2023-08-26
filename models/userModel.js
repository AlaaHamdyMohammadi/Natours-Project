const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have name'],
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User must have password'],
    minlength: [
      10,
      'A user password must have more or equal than 10 characters',
    ],
    // To never show up in any output
    select: false,
  },
  passwordConfirm: {
    type: String,
    //required means in the input, not required in db
    required: [true, 'User must confirm password'],
    validate: {
      // This only works on create ond on save
      //work when create new object(on .create or on save)
      validator: function (el) {
        return el === this.password; // if abc === abc => return true, if not return false
      },
      message: 'Passwords are not the same',
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{ //New user in website is an active user
    type: Boolean,
    default: true,
    select: false, //to hidden this flag about any one
  }
});

//encryption happens between getting the data and saving it to the database
userSchema.pre('save', async function (next) {
  //only run if password is modified
  if (!this.isModified('password')) return next();

  // 12 => costParameter : measure of how CPU intensive this operation
  this.password = await bcrypt.hash(this.password, 12);
  //delete to not show in db
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre('save', function (next) {
//   //If password not changed or not create new document
//   if (!this.isModified('password') || this.isNew) return next();

//   // -1000: To put passwordChangedAt one second in the past to ensure the token is always created after the password has been changed
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });


//To hidden the delete user from the output 
//Use Regular expression to match the find keyword with any findUpdata or findDelete
userSchema.pre(/^find/, function(next){
  //this points to the current query
  this.find({ active: {$ne: false} });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //Not Changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}, this.passwordResetToken)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
