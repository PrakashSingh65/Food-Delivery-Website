import { z } from 'zod';
import { ORDER_STATUS } from '../config/constants.js';

export const orderItemInputSchema = z.object({
  menuItemId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid menuItemId format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const calculatePriceSchema = z.object({
  restaurantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid restaurantId format'),
  items: z.array(orderItemInputSchema).min(1, 'At least one item is required'),
  couponCode: z.string().optional(),
  deliveryCoordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid restaurantId format'),
  items: z.array(orderItemInputSchema).min(1, 'Order must contain at least one item'),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['COD', 'CARD', 'UPI', 'ONLINE']).default('COD'),
  deliveryAddress: z.object({
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().optional(),
    latitude: z.number().min(-90).max(90).default(12.9716),
    longitude: z.number().min(-180).max(180).default(77.5946),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});
