import { Router } from 'express';
import { getOrderTrackingDetails, updateDeliveryCoordinates } from '../controllers/trackingController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { updateLocationSchema } from '../validations/trackingValidation.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.get('/:orderId', protect, getOrderTrackingDetails);
router.post(
  '/update-location',
  protect,
  restrictTo(USER_ROLES.DELIVERY_PARTNER, USER_ROLES.ADMIN),
  validate(updateLocationSchema),
  updateDeliveryCoordinates
);

export default router;
