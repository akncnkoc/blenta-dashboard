import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type EventTag = {
  id: string
  name: string
  culture: string
  question: string
}

export const eventTagApi = createApi({
  reducerPath: 'eventTag',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllEventTags: builder.query<
      {
        data: EventTag[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/event-tag`,
        params: { search, page, size, lang },
      }),
    }),
    getEventTag: builder.query<EventTag, string>({
      query: (eventTagId) => ({
        url: '/event-tag/' + eventTagId,
        method: 'GET',
      }),
    }),
    createEventTag: builder.mutation<
      void,
      { name: string; culture: string; question: string }
    >({
      query: (body) => ({
        url: '/event-tag',
        method: 'POST',
        body,
      }),
    }),
    updateEventTag: builder.mutation<
      void,
      { id: string; name: string; culture: string; question: string }
    >({
      query: ({ id, name, culture, question }) => ({
        url: `/event-tag/${id}`,
        method: 'PUT',
        body: { name, culture, question },
      }),
    }),
    deleteEventTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event-tag/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllEventTagsQuery,
  useLazyGetEventTagQuery,
  useCreateEventTagMutation,
  useUpdateEventTagMutation,
  useDeleteEventTagMutation,
} = eventTagApi
