const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appErrors');
const catchAsyc = require('../utils/catchAsyc');

exports.getOverview = catchAsyc(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsyc(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no Tour with that Name', 404));
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js',
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

exports.getLoginForm = (req, res, next) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com http://127.0.0.1:3000/api/v1/users/login https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js",
    )
    .render('login', {
      title: 'Log into your Account',
    });
};

exports.getAccount = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com http://127.0.0.1:3000/api/v1/users/login https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js",
    )
    .render('account', {
      title: 'Your Account',
    });
};



exports.updateUserData = catchAsyc(async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  console.log('at the point of rendering Account');
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com http://127.0.0.1:3000/api/v1/users/login https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js",
    )
    .render('account', {
      title: 'Your Account',
      user: updatedUser,
    });
});
