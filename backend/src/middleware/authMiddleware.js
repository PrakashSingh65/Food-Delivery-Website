import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Verifies JWT token and attaches authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Authentication required. Please provide a valid Bearer token.', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.error(res, 'User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token has expired. Please login again.', 401);
    }
    return ApiResponse.error(res, 'Invalid token. Authorization denied.', 401);
  }
};

/**
 * Restricts access to specific user roles
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'restaurant', 'delivery_partner')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Requires one of roles: [${roles.join(', ')}]. Current role: '${req.user?.role || 'anonymous'}'`,
        403
      );
    }
    next();
  };
};
