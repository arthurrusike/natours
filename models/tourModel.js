// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A tour Must have a name'],
      trim: true,
    },
    slug: String,
    duration: { type: Number, required: [true, 'Tour Must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour Must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour Must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Use Either : easy or medium or difficult',
      },
    },
    ratings: { type: Number, default: 4.5 },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must at least be 1'],
      max: [5, 'Ratings must not be more than 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour Must have a Price'] },
    priceDiscount: { type: Number },
    summary: { type: String, trim: true },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A Tour Must have cover Image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // Geo JSON in order to specify geo locations
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
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });


toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middleware runs before Save and Create. Not on Insert Many
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// toursSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secretTour: { $ne: false },
//     },
//   });

//   next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
