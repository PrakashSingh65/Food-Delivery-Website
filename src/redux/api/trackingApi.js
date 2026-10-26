import { baseApi } from './baseApi';
import { setActiveTracking } from '../slices/trackingSlice';

export const trackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderTrackingDetails: builder.query({
      query: (orderId) => `/tracking/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Tracking', id: orderId }],
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(setActiveTracking(data.data));
          }
        } catch (error) {
          // Handled by UI
        }
      },
    }),

    updateDeliveryLocation: builder.mutation({
      query: (coordsData) => ({
        url: '/tracking/update-location',
        method: 'POST',
        body: coordsData,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Tracking', id: orderId }],
    }),
  }),
});

export const {
  useGetOrderTrackingDetailsQuery,
  useUpdateDeliveryLocationMutation,
} = trackingApi;
