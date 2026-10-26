import { z } from 'zod';

export const updateLocationSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid orderId format'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  speed: z.number().optional(),
  heading: z.number().optional(),
});
