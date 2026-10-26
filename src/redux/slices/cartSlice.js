import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
  coupon: null,
  deliveryAddress: {
    street: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    latitude: 12.9279,
    longitude: 77.6713,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, _id, restaurantId, restaurantName } = action.payload;
      const itemId = id || _id;

      // If cart has items from another restaurant, reset cart with new restaurant
      if (state.restaurantId && restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.coupon = null;
      }

      if (restaurantId) state.restaurantId = restaurantId;
      if (restaurantName) state.restaurantName = restaurantName;

      const existingItem = state.items.find((item) => (item.id || item._id) === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, id: itemId, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => (item.id || item._id) !== id);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
        state.coupon = null;
      }
    },
    increaseQty: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => (item.id || item._id) === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQty: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => (item.id || item._id) === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter((i) => (i.id || i._id) !== id);
        if (state.items.length === 0) {
          state.restaurantId = null;
          state.restaurantName = '';
        }
      }
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = '';
      state.coupon = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  applyCoupon,
  removeCoupon,
  setDeliveryAddress,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
