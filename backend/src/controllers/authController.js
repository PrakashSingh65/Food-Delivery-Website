import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, vehicleType, address, coordinates } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, 'An account with this email already exists', 409, [
        { field: 'email', message: 'Email is already registered' },
      ]);
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'customer',
      phone: phone || '',
      address: address || {},
      vehicleType: vehicleType || 'bike',
    };

    if (coordinates && coordinates.longitude && coordinates.latitude) {
      userData.location = {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      };
    }

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    return ApiResponse.created(
      res,
      {
        user,
        token,
      },
      'User registered successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id, user.role);
    const sanitizedUser = user.toJSON();

    return ApiResponse.success(
      res,
      {
        user: sanitizedUser,
        token,
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, isOnline } = req.body;

    const updateFields = {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };

    if (typeof isOnline === 'boolean') {
      updateFields.isOnline = isOnline;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true });

    return ApiResponse.success(res, { user }, 'Location updated successfully');
  } catch (error) {
    next(error);
  }
};
