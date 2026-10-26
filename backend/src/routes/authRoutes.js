import { Router } from 'express';
import { register, login, getMe, updateLocation } from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema, updateLocationSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.patch('/location', protect, validate(updateLocationSchema), updateLocation);

export default router;
