import { Router } from 'express';
import { calculateCartSummary } from '../controllers/cartController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { calculatePriceSchema } from '../validations/orderValidation.js';

const router = Router();

// Validate items, check live stock, calculate delivery fees and tax breakdown
router.post('/summary', validate(calculatePriceSchema), calculateCartSummary);

export default router;
