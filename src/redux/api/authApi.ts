import type { AuthResponse, IUser, UpdateUserRequest } from "@/types/auth.types";
import { baseApi } from "./baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ১. ইউজার রেজিস্ট্রেশন
    register: builder.mutation<AuthResponse, Partial<IUser> & { password: string }>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ২. ইউজার লগইন
    login: builder.mutation<AuthResponse, Pick<IUser, 'email'> & { password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // ৩. কারেন্ট ইউজার প্রোফাইল গেট করা
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ৪. প্রোফাইল আপডেট
    updateMe: builder.mutation<{ success: boolean; message: string; user: IUser }, UpdateUserRequest | FormData>({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ৫. লগআউট
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useGetMeQuery, 
  useUpdateMeMutation,
  useLogoutMutation 
} = authApi;