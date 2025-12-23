import { baseApiService } from "./baseApiService";

export const noticeService = baseApiService.injectEndpoints({
  endpoints: (builder) => ({
    createNotice: builder.mutation({
      query: (data) => ({
        url: "/notices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notice"],
    }),
    getNotices: builder.query({
      query: (params) => ({
        url: "/notices",
        method: "GET",
        params,
      }),
      providesTags: ["Notice"],
    }),
    getNoticeById: builder.query({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Notice", id }],
    }),
    updateNotice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/notices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Notice", id },
        "Notice",
      ],
    }),
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notice"],
    }),
  }),
});

export const {
  useCreateNoticeMutation,
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeService;
