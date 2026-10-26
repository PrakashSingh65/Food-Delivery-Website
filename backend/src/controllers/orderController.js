import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { Restaurant } from '../models/Restaurant.js';
import { Coupon } from '../models/Coupon.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { calculateDistanceKm, calculatePriceBreakdown } from '../utils/priceCalculator.js';
import { ORDER_STATUS, VALID_STATUS_TRANSITIONS, USER_ROLES } from '../config/constants.js';
import { emitNewOrderAlert, emitOrderStatusChange } from '../sockets/socketHandler.js';

export const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, couponCode, paymentMethod, deliveryAddress } = req.body;
    const customerId = req.user._id;

    // 1. Verify restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }
    if (!restaurant.isAvailable) {
      return ApiResponse.error(res, 'Restaurant is currently closed for new orders', 400);
    }

    // 2. Fetch and verify all menu items
    const itemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await MenuItem.find({
      _id: { $in: itemIds },
      restaurantId,
    });

    if (dbMenuItems.length !== items.length) {
      return ApiResponse.error(res, 'One or more items are invalid or belong to a different restaurant', 400);
    }

    const orderItems = [];
    for (const reqItem of items) {
      const dbItem = dbMenuItems.find((i) => i._id.toString() === reqItem.menuItemId);
      if (!dbItem.isAvailable) {
        return ApiResponse.error(res, `Item '${dbItem.name}' is currently unavailable`, 400);
      }
      orderItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        imageUrl: dbItem.imageUrl,
        quantity: reqItem.quantity,
        total: dbItem.price * reqItem.quantity,
      });
    }

    // 3. Compute distance
    let distanceKm = 3;
    if (deliveryAddress && restaurant.location?.coordinates) {
      const [rLng, rLat] = restaurant.location.coordinates;
      distanceKm = calculateDistanceKm(deliveryAddress.latitude, deliveryAddress.longitude, rLat, rLng);
    }

    // 4. Validate coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
    }

    // 5. Price breakdown
    const priceBreakdown = calculatePriceBreakdown({
      items: orderItems,
      distanceKm,
      coupon,
    });

    // 6. Generate unique order number
    const orderNumber = `FD-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // 7. Estimated delivery time
    const estimatedMinutes = Math.max(restaurant.deliveryTimeMin || 30, Math.round(distanceKm * 5 + 20));
    const estimatedDeliveryTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    // 8. Create Order Document
    const order = await Order.create({
      orderNumber,
      customerId,
      restaurantId,
      items: orderItems,
      priceBreakdown,
      status: ORDER_STATUS.PENDING,
      paymentMethod,
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        postalCode: deliveryAddress.postalCode || '',
        location: {
          type: 'Point',
          coordinates: [deliveryAddress.longitude, deliveryAddress.latitude],
        },
      },
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          timestamp: new Date(),
          updatedBy: customerId,
          note: 'Order placed by customer',
        },
      ],
      estimatedDeliveryTime,
    });

    // 9. Emit real-time alert to restaurant
    emitNewOrderAlert(restaurantId, order);

    return ApiResponse.created(res, { order }, 'Order placed successfully');
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('restaurantId', 'name imageUrl address location deliveryTimeMin')
      .populate('deliveryPartnerId', 'name phone vehicleType location')
      .populate('customerId', 'name email phone');

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    // Authorization: customer, restaurant owner, delivery partner, or admin
    const userId = req.user._id.toString();
    const isCustomer = order.customerId?._id?.toString() === userId;
    const isDelivery = order.deliveryPartnerId?._id?.toString() === userId;
    const isRestaurant = req.user.role === USER_ROLES.RESTAURANT;
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isCustomer && !isDelivery && !isRestaurant && !isAdmin) {
      return ApiResponse.error(res, 'Not authorized to view this order', 403);
    }

    return ApiResponse.success(res, { order }, 'Order retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('restaurantId', 'name imageUrl address')
      .populate('deliveryPartnerId', 'name phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { orders }, 'Customer orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getRestaurantOrders = async (req, res, next) => {
  try {
    // Find restaurants owned by this user
    const restaurants = await Restaurant.find({ ownerId: req.user._id });
    const restaurantIds = restaurants.map((r) => r._id);

    const orders = await Order.find({ restaurantId: { $in: restaurantIds } })
      .populate('customerId', 'name phone')
      .populate('deliveryPartnerId', 'name phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { orders }, 'Restaurant orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getDeliveryPartnerOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      // Return assigned orders or orders ready for pickup
      filter.$or = [
        { deliveryPartnerId: req.user._id },
        { status: ORDER_STATUS.PREPARING, deliveryPartnerId: null },
      ];
    }

    const orders = await Order.find(filter)
      .populate('restaurantId', 'name address location')
      .populate('customerId', 'name phone address')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { orders }, 'Delivery partner orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: nextStatus, note, cancellationReason } = req.body;
    const user = req.user;

    const order = await Order.findById(id);
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const currentStatus = order.status;

    // Check valid lifecycle transition
    const allowedNextStatuses = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStatuses.includes(nextStatus)) {
      return ApiResponse.error(
        res,
        `Invalid status transition from '${currentStatus}' to '${nextStatus}'. Allowed: [${allowedNextStatuses.join(
          ', '
        )}]`,
        400
      );
    }

    // Role-based transition permissions
    if (nextStatus === ORDER_STATUS.CANCELLED) {
      if (user.role === USER_ROLES.CUSTOMER && currentStatus !== ORDER_STATUS.PENDING) {
        return ApiResponse.error(res, 'Order can only be cancelled while in PENDING status', 400);
      }
    }

    if (nextStatus === ORDER_STATUS.ACCEPTED || nextStatus === ORDER_STATUS.PREPARING) {
      if (user.role !== USER_ROLES.RESTAURANT && user.role !== USER_ROLES.ADMIN) {
        return ApiResponse.error(res, 'Only the restaurant or admin can accept or prepare orders', 403);
      }
    }

    if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
      // Assign delivery partner if not assigned
      if (!order.deliveryPartnerId && user.role === USER_ROLES.DELIVERY_PARTNER) {
        order.deliveryPartnerId = user._id;
      }
    }

    if (nextStatus === ORDER_STATUS.DELIVERED) {
      if (user.role !== USER_ROLES.DELIVERY_PARTNER && user.role !== USER_ROLES.ADMIN) {
        return ApiResponse.error(res, 'Only the delivery partner or admin can mark order as delivered', 403);
      }
      order.paymentStatus = 'COMPLETED';
    }

    // Apply updates
    order.status = nextStatus;
    if (cancellationReason) {
      order.cancellationReason = cancellationReason;
    }

    order.statusHistory.push({
      status: nextStatus,
      timestamp: new Date(),
      updatedBy: user._id,
      note: note || `Order updated to ${nextStatus} by ${user.role}`,
    });

    await order.save();

    // Emit live WebSocket update
    emitOrderStatusChange(order._id.toString(), order.customerId.toString(), order);

    return ApiResponse.success(res, { order }, `Order status successfully updated to ${nextStatus}`);
  } catch (error) {
    next(error);
  }
};
