const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, `public`)));

// 1) MIDDLEWARES

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, try after an hour'
});
app.use('/api', limiter);

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `unable to find url ${req.originalUrl} on this server`
  // });

  const err = new AppError(
    `unable to find url ${req.originalUrl} on this server`,
    404
  );

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
