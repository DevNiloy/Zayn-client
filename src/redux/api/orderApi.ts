
// ২. এন্ডপয়েন্ট ইনজেক্ট করা 💉

import { baseApi } from "./baseApi";


export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/place-order",
        method: "POST",
        body: orderData,
      }),
      // Order place hole admin list jeno auto refresh hoy
      invalidatesTags: ["Order"],
    }),
    // সব ক্যাটাগরি এবং সাব-ক্যাটাগরি গেট করা
    
  }),
});
export const {
  usePlaceOrderMutation
} = orderApi;