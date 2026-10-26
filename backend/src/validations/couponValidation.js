import { z } from 'zod';

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase(),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'flat']).default('percentage'),
  discountValue: z.number().positive(),
  minOrderValue: z.number().nonnegative().default(0),
  maxDiscount: z.number().positive().nullable().optional(),
  expiresAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});
