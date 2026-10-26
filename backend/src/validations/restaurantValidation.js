import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().optional(),
  cuisineTypes: z.array(z.string()).min(1, 'At least one cuisine type is required'),
  priceForTwo: z.number().min(50, 'Price for two must be at least 50'),
  deliveryTimeMin: z.number().min(10).max(120).default(30),
  imageUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().optional(),
  }),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  category: z.string().min(2, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  preparationTimeMin: z.number().min(5).max(120).default(20),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const queryRestaurantSchema = z.object({
  search: z.string().optional(),
  cuisine: z.string().optional(),
  isVeg: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  maxDeliveryTime: z.string().optional().transform(Number),
  minRating: z.string().optional().transform(Number),
  lat: z.string().optional().transform(Number),
  lng: z.string().optional().transform(Number),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});
