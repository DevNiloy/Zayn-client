import { baseApi } from "./baseApi"; // আপনার baseApi পাথটি এখানে দিন

// ১. ডাটা ইন্টারফেসগুলো (আগের মতোই থাকছে) 🧬
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories?: any[]; // এখানে 'C' ছোট হাতের করে দিন 🛠️
}

export interface ICategoryResponse {
  success: boolean;
  message: string;
  data: ICategory[];
}

// ২. এন্ডপয়েন্ট ইনজেক্ট করা 💉


export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // সব ক্যাটাগরি এবং সাব-ক্যাটাগরি গেট করা
    getNestedCategories: builder.query<ICategoryResponse, void>({
      query: () => "/admin/categories",
      providesTags: ["Category"], 
    }),

    // নতুন মেইন ক্যাটাগরি তৈরি (FormData এর জন্য)
    createCategory: builder.mutation<ICategoryResponse, FormData>({
      query: (formData) => ({
        url: "/admin/categories",
        method: "POST",
        body: formData,
        // FormData পাঠানোর সময় headers এ 'Content-Type' সেট করার প্রয়োজন নেই, ব্রাউজার নিজ থেকেই তা করে নেয়
      }),
      invalidatesTags: ["Category"],
    }),

    // মেইন ক্যাটাগরি ডিলিট
    deleteCategory: builder.mutation<ICategoryResponse, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // সাব-ক্যাটাগরি তৈরি
    createSubCategory: builder.mutation<ICategoryResponse, FormData>({
      query: (formData) => ({
        url: "/admin/categories/subcategories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    // সাব-ক্যাটাগরি ডিলিট
    deleteSubCategory: builder.mutation<ICategoryResponse, string>({
      query: (id) => ({
        url: `/admin/categories/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});
export const {
  useGetNestedCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = categoryApi;