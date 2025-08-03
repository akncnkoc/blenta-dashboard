import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type User = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: string
  createdAt: string
}

export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    authenticateUser: builder.mutation<
      { accessToken: string },
      { email: string; password: string }
    >({
      query(body) {
        return {
          method: 'POST',
          url: 'admin/authenticate',
          body,
        }
      },
    }),

    getAllUsers: builder.query<
      {
        data: User[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/user/users`,
        params: { search, page, size, lang },
      }),
    }),
  }),
})

export const { useAuthenticateUserMutation, useLazyGetAllUsersQuery } = userApi
