import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'
import { EventQuestionAnswer } from './event-api'

export const eventQuestionAnswerApi = createApi({
  reducerPath: 'eventQuestionAnswerApi',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllAnswers: builder.query<
      {
        data: EventQuestionAnswer[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { page?: string; size?: string; questionId?: string }
    >({
      query: ({ page, size }) => ({
        url: `/event-question-answer`,
        params: { page, size },
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
  useLazyGetAllAnswersQuery,
  useCreateEventMutation,
  useLazyGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventQuestionAnswerApi
