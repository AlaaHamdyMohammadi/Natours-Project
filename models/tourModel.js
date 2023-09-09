const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      //Schema type options
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 40 characters'],
      //validator: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priseDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Error number',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, //imageName in DB
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], //Arr contains number of strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //guides: Array,//Embedding
    guides: [
      {type: mongoose.Schema.ObjectId,
      ref: 'User'}
    ],
    tourReviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      }
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
});

//Virtual populate
tourSchema.virtual('tourReview', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// 1- Document middleware run before save event and create event
tourSchema.pre('save', function(next){
  //console.log(this);
  this.slug = slugify(this.name, {lower: true});
  next();
});


//Embedding connect between users and tours.
// tourSchema.pre('save',async function(next){
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//document param that save in db
// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });

// 2- Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}});

  this.start = Date.now()
  next();
});

tourSchema.pre(/^find/, function(next){
  //this: current document
  this.populate({path: 'guides', select: '-__v'});

  next()
})

tourSchema.post(/^find/, function(doc, next){
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
})

// 3- Aggrigation middleware
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match : {secretTour: {$ne: true}}})
  console.log(this);
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 

/*
//make middleware in Express using mongoose between two events
//Ex: each time a new document is saved to the db we can run function between save commend and actaul saving (so middleware in mongoose can called pre and post hooks)

four types middleware in mongoose: document - query - aggregate - model
we also define middleware in the schema

*/