const express = require('express');
const app = express();
const morgan = require('morgan');


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) middleware
// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Faild',
    message: `Can't find ${req.originalUrl} on this server!`,
  })
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});



// 3) routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter); 

module.exports = app;
