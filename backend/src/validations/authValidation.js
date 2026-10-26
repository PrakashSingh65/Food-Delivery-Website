import { z } from 'zod';
import { USER_ROLES } from '../config/constants.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.nativeEnum(USER_ROLES).default(USER_ROLES.CUSTOMER),
  phone: z.string().optional(),
  vehicleType: z.enum(['bike', 'scooter', 'bicycle', 'car']).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isOnline: z.boolean().optional(),
});
