import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { SOCKET_EVENTS, USER_ROLES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      logger.error('Socket authentication failed:', { error: err.message });
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user.name}, Role: ${socket.user.role})`);

    // Automatically join user's private room
    socket.join(`user:${socket.user._id}`);

    // Join Order Room
    socket.on(SOCKET_EVENTS.JOIN_ORDER, ({ orderId }) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
        logger.info(`Socket ${socket.id} joined room order:${orderId}`);
      }
    });

    // Leave Order Room
    socket.on(SOCKET_EVENTS.LEAVE_ORDER, ({ orderId }) => {
      if (orderId) {
        socket.leave(`order:${orderId}`);
        logger.info(`Socket ${socket.id} left room order:${orderId}`);
      }
    });

    // Join Restaurant Room
    socket.on(SOCKET_EVENTS.JOIN_RESTAURANT, ({ restaurantId }) => {
      if (restaurantId) {
        socket.join(`restaurant:${restaurantId}`);
        logger.info(`Socket ${socket.id} joined room restaurant:${restaurantId}`);
      }
    });

    // Delivery Partner emits real-time location update
    socket.on(
      SOCKET_EVENTS.DELIVERY_LOCATION_UPDATE,
      async ({ orderId, lat, lng, speed = 0, heading = 0 }) => {
        try {
          if (!orderId || lat === undefined || lng === undefined) {
            return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Missing orderId, lat, or lng' });
          }

          const now = new Date();

          // Broadcast to everyone tracking this order in real time
          io.to(`order:${orderId}`).emit(SOCKET_EVENTS.DELIVERY_LOCATION_UPDATED, {
            orderId,
            partnerId: socket.user._id,
            partnerName: socket.user.name,
            lat,
            lng,
            speed,
            heading,
            updatedAt: now.toISOString(),
          });

          // Asynchronously update coordinates in database
          await Order.findByIdAndUpdate(orderId, {
            deliveryPartnerLocation: {
              lat,
              lng,
              lastUpdated: now,
            },
          });
        } catch (error) {
          logger.error('Failed to update live delivery location:', { error: error.message });
        }
      }
    );

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Broadcast order status change to order room and customer's private room
 */
export const emitOrderStatusChange = (orderId, customerId, order) => {
  if (!ioInstance) return;

  const payload = {
    orderId,
    status: order.status,
    statusHistory: order.statusHistory,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    updatedAt: new Date().toISOString(),
  };

  ioInstance.to(`order:${orderId}`).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, payload);
  if (customerId) {
    ioInstance.to(`user:${customerId}`).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, payload);
  }
};

/**
 * Broadcast new incoming order alert to restaurant
 */
export const emitNewOrderAlert = (restaurantId, order) => {
  if (!ioInstance) return;

  ioInstance.to(`restaurant:${restaurantId}`).emit(SOCKET_EVENTS.NEW_ORDER_ALERT, {
    message: 'New order received!',
    order,
  });
};

export const getIO = () => ioInstance;
