// const dotenv = require('dotenv');
// dotenv.config({path: './config.env'})
// const app = require('./app');


// // console.log(process.env);

// // 4) start server
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

async function dbConnect() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
dbConnect();

const tourSchema = new mongoose.Schema({
  name: {
    //Schema type options
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number, 
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = Tour({
    name: 'The Forest name2',
    rating: 7.7,
    price: 700,
});

testTour.save().then((doc) => {
    console.log(doc);
}).catch(err => {
    console.log('EROOR : ', err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening from port ${port}`);
});

