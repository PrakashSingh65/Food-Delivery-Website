import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeOrderId: null,
  orderNumber: null,
  status: 'PENDING',
  statusHistory: [],
  partnerLocation: null, // { latitude, longitude, speed, heading, updatedAt }
  restaurantLocation: null,
  customerLocation: null,
  remainingDistanceKm: null,
  estimatedDeliveryTime: null,
  isTrackingActive: false,
};

export const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setActiveTracking: (state, action) => {
      const {
        orderId,
        orderNumber,
        status,
        statusHistory,
        restaurant,
        customerDeliveryAddress,
        deliveryPartner,
        remainingDistanceKm,
        estimatedDeliveryTime,
      } = action.payload;

      state.activeOrderId = orderId;
      state.orderNumber = orderNumber;
      state.status = status;
      state.statusHistory = statusHistory || [];
      state.restaurantLocation = restaurant;
      state.customerLocation = customerDeliveryAddress;
      state.partnerLocation = deliveryPartner?.coordinates || null;
      state.remainingDistanceKm = remainingDistanceKm;
      state.estimatedDeliveryTime = estimatedDeliveryTime;
      state.isTrackingActive = true;
    },
    updatePartnerLocation: (state, action) => {
      const { lat, lng, latitude, longitude, speed = 0, heading = 0, updatedAt } = action.payload;
      state.partnerLocation = {
        latitude: lat !== undefined ? lat : latitude,
        longitude: lng !== undefined ? lng : longitude,
        speed,
        heading,
        updatedAt: updatedAt || new Date().toISOString(),
      };
    },
    updateOrderStatus: (state, action) => {
      const { status, statusHistory, estimatedDeliveryTime } = action.payload;
      state.status = status;
      if (statusHistory) {
        state.statusHistory = statusHistory;
      }
      if (estimatedDeliveryTime) {
        state.estimatedDeliveryTime = estimatedDeliveryTime;
      }
      if (status === 'DELIVERED' || status === 'CANCELLED') {
        state.isTrackingActive = false;
      }
    },
    clearTracking: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setActiveTracking,
  updatePartnerLocation,
  updateOrderStatus,
  clearTracking,
} = trackingSlice.actions;

export default trackingSlice.reducer;
