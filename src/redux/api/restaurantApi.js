import { baseApi } from './baseApi';

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: (params = {}) => ({
        url: '/restaurants',
        params,
      }),
      providesTags: (result) =>
        result?.data?.restaurants
          ? [
              ...result.data.restaurants.map(({ _id }) => ({ type: 'Restaurant', id: _id })),
              { type: 'Restaurant', id: 'LIST' },
            ]
          : [{ type: 'Restaurant', id: 'LIST' }],
    }),

    getRestaurantById: builder.query({
      query: (id) => `/restaurants/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Restaurant', id },
        { type: 'MenuItem', id: `RESTAURANT_${id}` },
      ],
    }),

    toggleRestaurantAvailability: builder.mutation({
      query: (id) => ({
        url: `/restaurants/${id}/toggle-availability`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Restaurant', id },
        { type: 'Restaurant', id: 'LIST' },
      ],
    }),

    toggleMenuItemAvailability: builder.mutation({
      query: ({ restaurantId, itemId }) => ({
        url: `/restaurants/menu/${itemId}/toggle-availability`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { restaurantId }) => [
        { type: 'MenuItem', id: `RESTAURANT_${restaurantId}` },
      ],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useToggleRestaurantAvailabilityMutation,
  useToggleMenuItemAvailabilityMutation,
} = restaurantApi;
