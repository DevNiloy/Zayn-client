import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.mainichihalalshop.com/api",
   

    credentials: "include",
  }),

  tagTypes: [
    
  ],

  endpoints: () => ({}),
});
