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
}

export type UpdateCategoryRequest = {
  id: string
  name: string
  description: string
  parentCategoryId: string | null
  culture: string
  color: string
  type: string
  isPremiumCat: boolean
  isRefCat: boolean
}

export const categoryApi = createApi({
  reducerPath: 'category',
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
    updateCategory: builder.mutation<any, UpdateCategoryRequest>({
      query: (body) => ({
        url: `category/` + body.id,
        method: 'PUT',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (body) => ({
        url: `category/` + body,
        method: 'DELETE',
        body,
      }),
    }),
  }),
})

export const {
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi
