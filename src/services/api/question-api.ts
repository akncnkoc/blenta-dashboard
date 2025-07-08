import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type Question = {
  id: string
  title: string
  categoryId: string
  description: string
  sort: number
}
export type CreateCategoryQuestionRequest = {
  title: string
  categoryId: string
  description: string
  sort: number
}
export type UpdateCategoryQuestionRequest = {
  id: string
  title: string
  categoryId: string
  description: string
  sort: number
}

export const questionApi = createApi({
  reducerPath: 'question',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllQuestionFromCategory: builder.query<
      {
        questions: Question[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { page?: string; limit?: string; categoryId: string }
    >({
      query: ({ page, limit, categoryId }) => ({
        url: `/question/category/` + categoryId,
        params: { page, limit },
      }),
    }),
    createQuestion: builder.mutation<any, CreateCategoryQuestionRequest>({
      query: (body) => ({
        url: `question`,
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    updateQuestion: builder.mutation<any, UpdateCategoryQuestionRequest>({
      query: (body) => ({
        url: `question/` + body.id,
        method: 'PUT',
        body: {
          title: body.title,
          description: body.description,
          sort: body.sort,
          categoryId: body.categoryId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    deleteQuestion: builder.mutation<any, string>({
      query: (body) => ({
        url: `question/` + body,
        method: 'DELETE',
        body,
      }),
    }),
  }),
})

export const {
  useLazyGetAllQuestionFromCategoryQuery,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} = questionApi
