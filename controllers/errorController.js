const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const sendErrorProd = (err, res) => {
  //Operational error, send error to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other unkown error, don't send details to client
  }else{
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong !'
    });
  };
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(res, err);
  }else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }


  
};
