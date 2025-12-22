import { baseApiService } from "./baseApiService";

export const authService = baseApiService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query<any, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authService;
