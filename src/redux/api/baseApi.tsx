import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5001/api`,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Product", "Order", "Category"], 
  endpoints: () => ({}), // এন্ডপয়েন্টগুলো অন্য ফাইল থেকে ইনজেক্ট করা হবে
});