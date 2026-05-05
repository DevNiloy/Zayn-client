import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.zayn-bd.com/api",
    credentials: "include",
  }),
  tagTypes: ["User", "Product", "Order", "Category"],
  endpoints: () => ({}),
});
