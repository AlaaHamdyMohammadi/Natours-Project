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
        validator: function(el){
            return el === this.password; // if abc === abc => return true, if not return false
        },
        message: 'Passwords are not the same',
    }
  },
});

//encryption happens between getting the data and saving it to the database
userSchema.pre('save', async function(next){
    //only run if password is modified 
    if(!this.isModified('password')) return next();

    // 12 => costParameter : measure of how CPU intensive this operation 
    this.password = await bcrypt.hash(this.password, 12);
    //delete to not show in db
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;