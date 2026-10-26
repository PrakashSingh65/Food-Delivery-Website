import { baseApi } from './baseApi';
import { clearCart } from '../slices/cartSlice';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    calculateCartSummary: builder.mutation({
      query: (cartData) => ({
        url: '/cart/summary',
        method: 'POST',
        body: cartData,
      }),
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(clearCart());
          }
        } catch (error) {
          // Handled by UI
        }
      },
      invalidatesTags: ['Order', 'Cart'],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Order'],
    }),

    getRestaurantOrders: builder.query({
      query: () => '/orders/restaurant-orders',
      providesTags: ['Order'],
    }),

    getDeliveryOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders/delivery-orders',
        params,
      }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, note, cancellationReason }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status, note, cancellationReason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
  }),
});

export const {
  useCalculateCartSummaryMutation,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetRestaurantOrdersQuery,
  useGetDeliveryOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
