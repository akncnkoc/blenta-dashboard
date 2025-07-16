import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type Tag = {
  id: string
  name: string
}
export type CategoryTag = {
  id: string
  name: string
  categoryTagId: string
}

export const tagApi = createApi({
  reducerPath: 'tag',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllTags: builder.query<
      {
        data: Tag[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string; lang?: string }
    >({
      query: ({ search, page, size, lang }) => ({
        url: `/tag`,
        params: { search, page, size, lang },
      }),
    }),
    getAllCategoryTags: builder.query<
      {
        tags: CategoryTag[]
      },
      { categoryId: string }
    >({
      query: ({ categoryId }) => ({
        url: `/tag/category/` + categoryId,
      }),
    }),
    createTag: builder.mutation<void, { name: string }>({
      query: (body) => ({
        url: '/tag',
        method: 'POST',
        body,
      }),
    }),
    updateTag: builder.mutation<void, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/tag/${id}`,
        method: 'PUT',
        body: { name },
      }),
    }),
    addCategoryTag: builder.mutation<
      void,
      { categoryId: string; tagId: string }
    >({
      query: (body) => ({
        url: '/category/' + body.categoryId + '/addTag',
        method: 'PUT',
        body: {
          tagId: body.tagId,
        },
      }),
    }),
    deleteCategoryTag: builder.mutation<void, { categoryTagId: string }>({
      query: (body) => ({
        url: '/tag/categoryTag/' + body.categoryTagId,
        method: 'DELETE',
      }),
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tag/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllTagsQuery,
  useDeleteTagMutation,
  useUpdateTagMutation,
  useCreateTagMutation,
  useAddCategoryTagMutation,
  useLazyGetAllCategoryTagsQuery,
  useDeleteCategoryTagMutation,
} = tagApi
