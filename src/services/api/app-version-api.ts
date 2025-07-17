import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type AppVersion = {
  id: string
  version: string
  created_at: string
}

export const appVersionApi = createApi({
  reducerPath: 'appVersion',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllAppVersion: builder.query<
      {
        data: AppVersion[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string }
    >({
      query: ({ search, page, size }) => ({
        url: `/app-version`,
        params: { search, page, size },
      }),
    }),
    createAppVersion: builder.mutation<void, { version: string }>({
      query: (body) => ({
        url: '/app-version',
        method: 'POST',
        body,
      }),
    }),
    deleteAppVersion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/app-version/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllAppVersionQuery,
  useCreateAppVersionMutation,
  useDeleteAppVersionMutation,
} = appVersionApi
