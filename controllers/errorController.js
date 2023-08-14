const AppError = require('./../utils/appError');

const handleCastError = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = err => {
  const value = err.keyValue.name;
  const message = `duplicate field value : "${value}", please use another value`;
  console.log(value);
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err =>
  new AppError('Invalid token, please login again', 401);

const handleJWTExpiredError = err =>
  new AppError('JWT Token Expired, Please login again', 401);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    Stack: err.stack
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log('Error :', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastError(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFields(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }
    sendErrProd(error, res);
  }
};
