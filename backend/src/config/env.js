import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/food_delivery_db'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BASE_DELIVERY_FEE: z.string().default('30').transform(Number),
  PER_KM_DELIVERY_FEE: z.string().default('10').transform(Number),
  FREE_DELIVERY_THRESHOLD: z.string().default('500').transform(Number),
  TAX_RATE_PERCENTAGE: z.string().default('5').transform(Number),
  PLATFORM_FEE: z.string().default('5').transform(Number),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:');
    parsed.error.errors.forEach((err) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  return parsed.data;
};

export const env = parseEnv();
