import { baseApi } from "./baseApi";

// --- টাইপস বা ইন্টারফেসসমূহ 🏷️ ---

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  desc: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };

  subCategory?: {
    _id: string;
    name: string;
  };
  stock: "available" | "out of stock";
  stockQuantity: number;
  bestSeller?: boolean;
  purchaseCount?: number;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// এপিআই রেসপন্সের সাধারণ ফরম্যাট
export interface IProductResponse {
  success: boolean;
  message: string;
  data: IProduct[];
}

// সব প্রোডাক্ট লিস্টের রেসপন্স ফরম্যাট
export interface IAllProductsResponse {
  success: boolean;
  message: string;
  data: IProduct[];
}

// --- প্রোডাক্ট এপিআই স্লাইস 💉 ---

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // সব প্রোডাক্ট গেট করা 📦
    getAllProducts: builder.query<IAllProductsResponse, void>({
      query: () => "products",
      providesTags: ["Product"],
    }),

     getProducts: builder.query<IProductResponse, any>({
      query: (params) => ({ url: "/products", params }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query<IProduct, string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    // সিঙ্গেল প্রোডাক্ট ডিটেইলস 🔍
    getProductDetails: builder.query<IProduct, string>({
      query: (id) => `/admin/products/${id}`,
      // providesTags: ( id) => [{ type: "Product", id }],
      providesTags: ["Product"]
    }),

    // নতুন প্রোডাক্ট তৈরি (ইমেজের জন্য FormData ব্যবহার করা হয়েছে) ✨
    createProduct: builder.mutation<IProductResponse, FormData>({
      query: (formData) => ({
        url: "/admin/products",
        method: "POST",
        body: formData,
        // FormData পাঠালে আলাদা করে header দেওয়ার দরকার নেই, ব্রাউজার নিজে সেট করে নেয়।
      }),
      invalidatesTags: ["Product"],
    }),

    // প্রোডাক্ট আপডেট করা 🔄
    updateProduct: builder.mutation<IProductResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      // invalidatesTags: ( { id  }) => ["Product", { type: "Product", id }],
    }),

    // প্রোডাক্ট ডিলিট করা 🗑️
    deleteProduct: builder.mutation<IProductResponse, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getProductBySlug: builder.query<IProduct, string>({
      query: (slug) => ({
        url: `/products/details/${slug}`, // Router-er sathe exact match
        method: "GET",
      }),
      providesTags: ["Product"],
      // Backend { success: true, data: {...} } pathachche, tai transform dorkar
      transformResponse: (response: any) => response?.data || response,
    }),

    createReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/product/review/${id}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    
  }),
});

// হুকস এক্সপোর্ট করা ⚓
export const {
  useCreateReviewMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery
} = productApi;