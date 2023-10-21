const multer = require('multer');
const sharp = require('sharp');
const catchAsyc = require('../utils/catchAsyc');
const User = require('../models/userModel');
const AppError = require('../utils/appErrors');
const handlerFactory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callBack) => {
  // console.log(file);
  if (file.mimetype.startsWith('image')) {
    callBack(null, true);
  } else {
    callBack(new AppError('Not an Image. Please Upload an Image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsyc(async (req, res, next) => {
  req.file.filename = `user-${req.id}-${Date.now()}.jpeg}`;

  if (!req.file) return next();

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObjMethod = (obj, ...allowedFields) => {
  const newFilteredObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newFilteredObj[el] = obj[el];
  });

  return newFilteredObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsyc(async (req, res, next) => {
  //1.) Create error if user Posts password Data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Please use /updateMyPassword', 400));
  }

  //2 Update User Document
  const filteredBody = filterObjMethod(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined  Please use Sign Up Instead',
  });
};

exports.deleteMe = catchAsyc(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User); // Not for password update
exports.deleteUser = handlerFactory.deleteOne(User);
