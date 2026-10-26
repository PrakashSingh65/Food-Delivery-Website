import { io } from 'socket.io-client';
import { updatePartnerLocation, updateOrderStatus } from '../slices/trackingSlice';
import { baseApi } from '../api/baseApi';

// Custom Action Types
export const SOCKET_CONNECT = 'socket/connect';
export const SOCKET_DISCONNECT = 'socket/disconnect';
export const SOCKET_JOIN_ORDER = 'socket/joinOrder';
export const SOCKET_LEAVE_ORDER = 'socket/leaveOrder';
export const SOCKET_EMIT_LOCATION = 'socket/emitLocation';

// Action Creators for UI components to dispatch
export const connectSocket = () => ({ type: SOCKET_CONNECT });
export const disconnectSocket = () => ({ type: SOCKET_DISCONNECT });
export const joinOrderRoom = (orderId) => ({ type: SOCKET_JOIN_ORDER, payload: { orderId } });
export const leaveOrderRoom = (orderId) => ({ type: SOCKET_LEAVE_ORDER, payload: { orderId } });
export const emitDeliveryLocation = (payload) => ({ type: SOCKET_EMIT_LOCATION, payload });

let socket = null;

export const socketMiddleware = (store) => (next) => (action) => {
  const { dispatch, getState } = store;

  switch (action.type) {
    case SOCKET_CONNECT: {
      if (socket) {
        socket.disconnect();
      }

      const token = getState().auth.token || localStorage.getItem('token');
      const socketUrl = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:5000';

      socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      socket.on('connect', () => {
        console.log('[Socket] Connected to real-time server:', socket.id);
      });

      // Handle real-time delivery coordinates broadcast
      socket.on('delivery:location_updated', (data) => {
        console.log('[Socket] Delivery location updated:', data);
        dispatch(updatePartnerLocation(data));
      });

      // Handle real-time order lifecycle status changes
      socket.on('order:status_updated', (data) => {
        console.log('[Socket] Order status updated:', data);
        dispatch(updateOrderStatus(data));
        // Invalidate RTK query cache to re-fetch fresh order details seamlessly
        dispatch(baseApi.util.invalidateTags([{ type: 'Order', id: data.orderId }]));
      });

      socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
      });

      socket.on('connect_error', (error) => {
        console.error('[Socket] Connection error:', error.message);
      });

      break;
    }

    case SOCKET_DISCONNECT: {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      break;
    }

    case SOCKET_JOIN_ORDER: {
      if (socket && action.payload?.orderId) {
        socket.emit('join:order', { orderId: action.payload.orderId });
      }
      break;
    }

    case SOCKET_LEAVE_ORDER: {
      if (socket && action.payload?.orderId) {
        socket.emit('leave:order', { orderId: action.payload.orderId });
      }
      break;
    }

    case SOCKET_EMIT_LOCATION: {
      if (socket) {
        socket.emit('delivery:location_update', action.payload);
      }
      break;
    }

    default:
      break;
  }

  return next(action);
};
