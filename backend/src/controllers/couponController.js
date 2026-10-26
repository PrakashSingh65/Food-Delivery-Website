import { Coupon } from '../models/Coupon.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return ApiResponse.error(res, 'Invalid or expired coupon code', 400);
    }

    if (subtotal < coupon.minOrderValue) {
      return ApiResponse.error(
        res,
        `Cart subtotal must be at least ₹${coupon.minOrderValue} to apply coupon ${coupon.code}`,
        400
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      const calcDiscount = (subtotal * coupon.discountValue) / 100;
      discount = coupon.maxDiscount ? Math.min(calcDiscount, coupon.maxDiscount) : calcDiscount;
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);
    discount = Math.round(discount);

    return ApiResponse.success(
      res,
      {
        couponCode: coupon.code,
        discount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
      },
      'Coupon applied successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const listActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: new Date() },
    }).sort({ minOrderValue: 1 });

    return ApiResponse.success(res, { coupons }, 'Active coupons fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expiresAt, isActive } =
      req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return ApiResponse.error(res, 'Coupon with this code already exists', 409);
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || null,
      expiresAt: new Date(expiresAt),
      isActive: isActive !== undefined ? isActive : true,
    });

    return ApiResponse.created(res, { coupon }, 'Coupon created successfully');
  } catch (error) {
    next(error);
  }
};
