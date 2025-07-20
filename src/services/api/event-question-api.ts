import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'
import { EventQuestion } from './event-api'

export const eventQuestionApi = createApi({
  reducerPath: 'eventQuestionApi',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllEventQuestions: builder.query<
      {
        data: EventQuestion[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/event-question`,
        params: { search, page, size, lang },
      }),
    }),
    getEventQuestion: builder.query<EventQuestion, string>({
      query: (eventQuestionId) => ({
        url: '/event-question/' + eventQuestionId,
        method: 'GET',
      }),
    }),
    createEventQuestion: builder.mutation<
      void,
      { text: string; culture: string; answers: Array<string> }
    >({
      query: (body) => ({
        url: '/event-question',
        method: 'POST',
        body,
      }),
    }),
    updateEventQuestion: builder.mutation<
      void,
      { id: string; text: string; culture: string; answers: Array<string> }
    >({
      query: ({ id, text, culture, answers }) => ({
        url: `/event-question/${id}`,
        method: 'PUT',
        body: { text, culture, answers },
      }),
    }),
    deleteEventQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event-question/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllEventQuestionsQuery,
  useLazyGetEventQuestionQuery,
  useCreateEventQuestionMutation,
  useUpdateEventQuestionMutation,
  useDeleteEventQuestionMutation,
} = eventQuestionApi
