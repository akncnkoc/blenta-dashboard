import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type Event = {
  id: string
  name: string
  description: string | null
  culture: string
  matches: Array<EventMatch>
}
export type EventQuestion = {
  id: string
  text: string
  culture: string
  createdAt: string
  answers: EventQuestionAnswer[]
}

export type EventQuestionAnswer = {
  id: string
  text: string
  questionId: string
  question: EventQuestion
  matches: EventMatch[]
}
export type EventMatch = {
  id: string
  eventId: string
  answerId: string
  event: Event
  answer: EventQuestionAnswer
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
      {
        name: string | null
        culture: string
        answerIds: Array<string>
        description: string | null
      }
    >({
      query: (body) => ({
        url: '/event',
        method: 'POST',
        body,
      }),
    }),
    updateEvent: builder.mutation<
      void,
      {
        id: string
        name: string | null
        culture: string
        answerIds: Array<string>
        description: string | null
      }
    >({
      query: ({ id, name, culture, answerIds, description }) => ({
        url: `/event/${id}`,
        method: 'PUT',
        body: { name, culture, answerIds, description },
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
