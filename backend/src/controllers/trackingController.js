import { Order } from '../models/Order.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { calculateDistanceKm } from '../utils/priceCalculator.js';
import { getIO } from '../sockets/socketHandler.js';
import { SOCKET_EVENTS } from '../config/constants.js';

export const getOrderTrackingDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('restaurantId', 'name address location phone imageUrl')
      .populate('deliveryPartnerId', 'name phone vehicleType location')
      .populate('customerId', 'name phone');

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const restaurantCoords = order.restaurantId?.location?.coordinates || [77.5946, 12.9716];
    const customerCoords = order.deliveryAddress?.location?.coordinates || [77.5946, 12.9716];

    // Partner coordinates: prioritize live coordinate on order, fallback to partner profile coordinates
    let partnerCoords = null;
    if (order.deliveryPartnerLocation?.lat && order.deliveryPartnerLocation?.lng) {
      partnerCoords = {
        latitude: order.deliveryPartnerLocation.lat,
        longitude: order.deliveryPartnerLocation.lng,
        lastUpdated: order.deliveryPartnerLocation.lastUpdated,
      };
    } else if (order.deliveryPartnerId?.location?.coordinates) {
      partnerCoords = {
        latitude: order.deliveryPartnerId.location.coordinates[1],
        longitude: order.deliveryPartnerId.location.coordinates[0],
        lastUpdated: order.updatedAt,
      };
    }

    // Calculate distance remaining
    let remainingDistanceKm = null;
    if (partnerCoords) {
      remainingDistanceKm = calculateDistanceKm(
        partnerCoords.latitude,
        partnerCoords.longitude,
        customerCoords[1],
        customerCoords[0]
      );
    }

    return ApiResponse.success(
      res,
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        statusHistory: order.statusHistory,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        restaurant: {
          name: order.restaurantId?.name,
          address: order.restaurantId?.address,
          latitude: restaurantCoords[1],
          longitude: restaurantCoords[0],
        },
        customerDeliveryAddress: {
          street: order.deliveryAddress.street,
          city: order.deliveryAddress.city,
          latitude: customerCoords[1],
          longitude: customerCoords[0],
        },
        deliveryPartner: order.deliveryPartnerId
          ? {
              id: order.deliveryPartnerId._id,
              name: order.deliveryPartnerId.name,
              phone: order.deliveryPartnerId.phone,
              vehicleType: order.deliveryPartnerId.vehicleType,
              coordinates: partnerCoords,
            }
          : null,
        remainingDistanceKm,
      },
      'Tracking details fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryCoordinates = async (req, res, next) => {
  try {
    const { orderId, latitude, longitude, speed = 0, heading = 0 } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    const now = new Date();
    order.deliveryPartnerLocation = {
      lat: latitude,
      lng: longitude,
      lastUpdated: now,
    };
    await order.save();

    const io = getIO();
    if (io) {
      io.to(`order:${orderId}`).emit(SOCKET_EVENTS.DELIVERY_LOCATION_UPDATED, {
        orderId,
        partnerId: req.user._id,
        lat: latitude,
        lng: longitude,
        speed,
        heading,
        updatedAt: now.toISOString(),
      });
    }

    return ApiResponse.success(res, { orderId, latitude, longitude }, 'Live coordinates updated successfully');
  } catch (error) {
    next(error);
  }
};
