import { MenuItem } from '../models/MenuItem.js';
import { Restaurant } from '../models/Restaurant.js';
import { Coupon } from '../models/Coupon.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { calculateDistanceKm, calculatePriceBreakdown } from '../utils/priceCalculator.js';

export const calculateCartSummary = async (req, res, next) => {
  try {
    const { restaurantId, items, couponCode, deliveryCoordinates } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }

    if (!restaurant.isAvailable) {
      return ApiResponse.error(res, 'This restaurant is currently closed for new orders', 400);
    }

    // Extract item IDs and fetch from DB
    const itemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await MenuItem.find({
      _id: { $in: itemIds },
      restaurantId,
    });

    if (dbMenuItems.length !== items.length) {
      return ApiResponse.error(
        res,
        'One or more items do not exist or belong to a different restaurant',
        400
      );
    }

    // Check availability & map with quantities
    const unavailableItems = [];
    const enrichedItems = items.map((reqItem) => {
      const dbItem = dbMenuItems.find((i) => i._id.toString() === reqItem.menuItemId);
      if (!dbItem.isAvailable) {
        unavailableItems.push(dbItem.name);
      }
      return {
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        imageUrl: dbItem.imageUrl,
        quantity: reqItem.quantity,
        total: dbItem.price * reqItem.quantity,
      };
    });

    if (unavailableItems.length > 0) {
      return ApiResponse.error(
        res,
        `The following items are currently out of stock: ${unavailableItems.join(', ')}`,
        400
      );
    }

    // Distance calculation
    let distanceKm = 3;
    if (deliveryCoordinates && restaurant.location?.coordinates) {
      const [rLng, rLat] = restaurant.location.coordinates;
      distanceKm = calculateDistanceKm(
        deliveryCoordinates.latitude,
        deliveryCoordinates.longitude,
        rLat,
        rLng
      );
    }

    // Check coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
    }

    const priceBreakdown = calculatePriceBreakdown({
      items: enrichedItems,
      distanceKm,
      coupon,
    });

    return ApiResponse.success(
      res,
      {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          deliveryTimeMin: restaurant.deliveryTimeMin,
        },
        items: enrichedItems,
        priceBreakdown,
      },
      'Cart summary calculated successfully'
    );
  } catch (error) {
    next(error);
  }
};
