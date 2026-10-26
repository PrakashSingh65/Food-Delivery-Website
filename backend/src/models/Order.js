import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, 'Order must contain at least one item'],
    },
    priceBreakdown: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, required: true, default: 0 },
      taxes: { type: Number, required: true, default: 0 },
      platformFee: { type: Number, required: true, default: 5 },
      discount: { type: Number, default: 0 },
      appliedCoupon: { type: String, default: null },
      grandTotal: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'UPI', 'ONLINE'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, default: '' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [lng, lat]
          default: [77.5946, 12.9716],
        },
      },
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    deliveryPartnerLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      lastUpdated: { type: Date, default: null },
    },
    estimatedDeliveryTime: {
      type: Date,
      default: () => new Date(Date.now() + 35 * 60 * 1000), // 35 minutes from now
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ 'deliveryAddress.location': '2dsphere' });

export const Order = mongoose.model('Order', orderSchema);
