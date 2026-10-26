import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getRestaurantOrders,
  getDeliveryPartnerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

// Customer creates order
router.post('/', protect, validate(createOrderSchema), createOrder);

// Customer gets their order history
router.get('/my-orders', protect, getCustomerOrders);

// Restaurant gets incoming orders
router.get(
  '/restaurant-orders',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  getRestaurantOrders
);

// Delivery partner gets delivery assignments
router.get(
  '/delivery-orders',
  protect,
  restrictTo(USER_ROLES.DELIVERY_PARTNER, USER_ROLES.ADMIN),
  getDeliveryPartnerOrders
);

// Get single order details
router.get('/:id', protect, getOrderById);

// Update status through lifecycle
router.patch('/:id/status', protect, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
