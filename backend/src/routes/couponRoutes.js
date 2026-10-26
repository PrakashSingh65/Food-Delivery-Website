import { Router } from 'express';
import { validateCoupon, listActiveCoupons, createCoupon } from '../controllers/couponController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateCouponSchema, createCouponSchema } from '../validations/couponValidation.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.get('/', listActiveCoupons);
router.post('/validate', validate(validateCouponSchema), validateCoupon);
router.post('/', protect, restrictTo(USER_ROLES.ADMIN), validate(createCouponSchema), createCoupon);

export default router;
