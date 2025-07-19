import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type Event = {
  id: string
  name: string
  culture: string
  tagIds: Array<string>
}

export const eventApi = createApi({
  reducerPath: 'event',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllEvents: builder.query<
      {
        data: Event[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/event`,
        params: { search, page, size, lang },
      }),
    }),
    getEvent: builder.query<Event, string>({
      query: (eventTagId) => ({
        url: '/event/' + eventTagId,
        method: 'GET',
      }),
    }),
    createEvent: builder.mutation<
      void,
      { name: string; culture: string; tagIds: Array<string> }
    >({
      query: (body) => ({
        url: '/event',
        method: 'POST',
        body,
      }),
    }),
    updateEvent: builder.mutation<
      void,
      { id: string; name: string; culture: string; tagIds: Array<string> }
    >({
      query: ({ id, name, culture, tagIds }) => ({
        url: `/event/${id}`,
        method: 'PUT',
        body: { name, culture, tagIds },
      }),
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllEventsQuery,
  useCreateEventMutation,
  useLazyGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi
