import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Item category is required'],
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isVeg: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    preparationTimeMin: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
