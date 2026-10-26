import { env } from '../config/env.js';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3; // Default 3km fallback if coordinates missing
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
};

/**
 * Calculates complete order price breakdown
 */
export const calculatePriceBreakdown = ({
  items = [],
  distanceKm = 3,
  coupon = null,
}) => {
  // 1. Subtotal calculation
  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  // 2. Delivery fee calculation
  let deliveryFee = env.BASE_DELIVERY_FEE;
  if (subtotal >= env.FREE_DELIVERY_THRESHOLD) {
    deliveryFee = 0;
  } else if (distanceKm > 2) {
    deliveryFee += (distanceKm - 2) * env.PER_KM_DELIVERY_FEE;
  }
  deliveryFee = Math.round(deliveryFee);

  // 3. Discount calculation
  let discount = 0;
  let appliedCoupon = null;

  if (coupon && coupon.isActive) {
    const now = new Date();
    if (!coupon.expiresAt || new Date(coupon.expiresAt) > now) {
      if (subtotal >= (coupon.minOrderValue || 0)) {
        if (coupon.discountType === 'percentage') {
          const calcDiscount = (subtotal * coupon.discountValue) / 100;
          discount = coupon.maxDiscount ? Math.min(calcDiscount, coupon.maxDiscount) : calcDiscount;
        } else if (coupon.discountType === 'flat') {
          discount = coupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
        discount = Math.round(discount);
        appliedCoupon = coupon.code;
      }
    }
  }

  // 4. Taxes & Platform fee
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const taxes = Math.round((discountedSubtotal * env.TAX_RATE_PERCENTAGE) / 100);
  const platformFee = env.PLATFORM_FEE;

  // 5. Grand Total
  const grandTotal = Math.round(discountedSubtotal + deliveryFee + taxes + platformFee);

  return {
    subtotal: Math.round(subtotal),
    deliveryFee,
    taxes,
    platformFee,
    discount,
    appliedCoupon,
    grandTotal,
    distanceKm: Number(distanceKm),
  };
};
