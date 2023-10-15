const AppError = require('../utils/appErrors');

const handleCastErrorDB = (err) => {
  const message = `Invalid email address. Please provide a Valid email address `;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = err.message.match(/(['"])(\\?.)*?\1/)[0];

  const message = `Duplicate filed value Invalid ${value} please use another value:`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError('Invalid Token. Please login again', 401);

const handleJWTExipredDB = () =>
  new AppError('Your Token has expired. PLease login again', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //Rendered Web Page
    res.status(err.statusCode).render('error', {
      title: 'Something has gone wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //2. Send Error to user
    return res.status(500).json({
      status: 'err',
      message: 'Something went wrong',
    });
  }
  //Rendered Web Page
  return res.status(err.statusCode).render('error', {
    title: 'Something has gone wrong',
    msg: err.message,
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'err';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errors = { err };

    if (errors.name === 'CastError') errors = handleCastErrorDB(errors);
    if (errors.code === 11000) errors = handleDublicateFieldsDB(errors);
    if (errors.name === 'ValidationError')
      errors = handleValidationErrorDB(errors);
    if (errors.name === 'ValidatorError')
      errors = handleValidationErrorDB(errors);
    if (errors.name === 'JsonWebTokenError') errors = handleJWTErrorDB(errors);
    if (errors.name === 'TokenExipredError')
      errors = handleJWTExipredDB(errors);

    sendErrorProd(errors, req, res);
  }
};
