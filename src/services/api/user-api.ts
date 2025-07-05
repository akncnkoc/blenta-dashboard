import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

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
  }),
})

export const { useAuthenticateUserMutation } = userApi
