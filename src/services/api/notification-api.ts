import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type AppVersion = {
  id: string
  version: string
  created_at: string
}

export const notificationApi = createApi({
  reducerPath: 'notification',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    sendNotification: builder.mutation<
      void,
      { title: string; message: string }
    >({
      query: (body) => ({
        url: 'notification/send-notification',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useSendNotificationMutation } = notificationApi
