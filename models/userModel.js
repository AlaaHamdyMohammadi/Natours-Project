const mongoose = require('mongoose');
const validator = require('validator');

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
  password: {
    type: String,
    required: [true, 'User must have password'],
    minlength: [
      10,
      'A user password must have more or equal than 10 characters',
    ],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
        // This only works on create ond on save
        //work when create new object(on .create or on save)
        validator: function(el){
            return el === this.password; // if abc === abc => return true, if not return false
        },
        message: 'Passwords are not the same',
    }
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;