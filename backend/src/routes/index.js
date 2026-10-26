import { Router } from 'express';
import authRoutes from './authRoutes.js';
import restaurantRoutes from './restaurantRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import couponRoutes from './couponRoutes.js';
import trackingRoutes from './trackingRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/tracking', trackingRoutes);

export default router;
