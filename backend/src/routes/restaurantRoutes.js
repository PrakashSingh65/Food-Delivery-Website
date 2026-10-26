import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantAvailability,
  addMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
} from '../controllers/restaurantController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  queryRestaurantSchema,
  createRestaurantSchema,
  updateRestaurantSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from '../validations/restaurantValidation.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

// Public routes
router.get('/', validate(queryRestaurantSchema, 'query'), getRestaurants);
router.get('/:id', getRestaurantById);

// Restaurant & Admin Management
router.post(
  '/',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  validate(createRestaurantSchema),
  createRestaurant
);

router.patch(
  '/:id',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  validate(updateRestaurantSchema),
  updateRestaurant
);

router.patch(
  '/:id/toggle-availability',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  toggleRestaurantAvailability
);

router.post(
  '/:id/menu',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  validate(createMenuItemSchema),
  addMenuItem
);

router.patch(
  '/menu/:itemId',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  validate(updateMenuItemSchema),
  updateMenuItem
);

router.patch(
  '/menu/:itemId/toggle-availability',
  protect,
  restrictTo(USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
  toggleMenuItemAvailability
);

export default router;
