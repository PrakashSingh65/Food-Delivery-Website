import { baseApi } from './baseApi';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveCoupons: builder.query({
      query: () => '/coupons',
      providesTags: ['Coupon'],
    }),

    validateCoupon: builder.mutation({
      query: ({ code, subtotal }) => ({
        url: '/coupons/validate',
        method: 'POST',
        body: { code, subtotal },
      }),
    }),
  }),
});

export const { useGetActiveCouponsQuery, useValidateCouponMutation } = couponApi;
