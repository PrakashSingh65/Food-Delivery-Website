import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    cuisineTypes: {
      type: [String],
      default: [],
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 120,
    },
    priceForTwo: {
      type: Number,
      default: 400,
    },
    deliveryTimeMin: {
      type: Number,
      default: 30, // in minutes
    },
    imageUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, default: '' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [77.5946, 12.9716],
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', description: 'text' });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
