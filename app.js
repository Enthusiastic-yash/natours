const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middle  ware

//serving static files
app.use(express.static(path.join(__dirname, 'public')));
//Set security HTTP headers
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit  request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP address Please try again in an hour!',
});

app.use('/api', limiter);

//Body parser , reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Here update name and email without api use then use this way
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//cookie parser , reading data from cookie into req.
app.use(cookieParser());

//Data sanitization against NoSQL auery injection
app.use(mongoSanitize());
//Data sanitization against xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Another middle ware to get time just for testing purposes middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// route handler---------------------------------------

// route

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//unexpected route handler--------------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl}on this server!`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
