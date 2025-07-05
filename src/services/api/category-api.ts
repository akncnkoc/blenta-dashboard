import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type Category = {
  id: string
  name: string
  description: string
  color: string
  culture: string
  isPremiumCat: boolean
  isRefCat: boolean
  questionCount: number
  type: 'QUESTION' | 'TEST'
}
export type CreateCategoryRequest = {
  name: string
  description: string
  parentCategoryId: string | null
  culture: string
  color: string
  type: string
  isPremiumCat: boolean
  isRefCat: boolean
  referenceCode: string | null
}

export const categoryApi = createApi({
  reducerPath: 'user',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      {
        data: Category[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/category`,
        params: { search, page, size, lang },
      }),
    }),
    getCategory: builder.query<any, string>({
      query: (categoryId) => ({
        url: `/category/` + categoryId,
      }),
    }),
    createCategory: builder.mutation<any, CreateCategoryRequest>({
      query: (body) => ({
        url: `category`,
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
})

export const {
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryQuery,
  useCreateCategoryMutation,
} = categoryApi
