import { baseApi } from './baseApi';
import { setCredentials, logout } from '../slices/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(setCredentials(data.data));
          }
        } catch (error) {
          // Handled by UI
        }
      },
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(setCredentials(data.data));
          }
        } catch (error) {
          // Handled by UI
        }
      },
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    updatePartnerLocation: builder.mutation({
      query: (coords) => ({
        url: '/auth/location',
        method: 'PATCH',
        body: coords,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdatePartnerLocationMutation,
} = authApi;
