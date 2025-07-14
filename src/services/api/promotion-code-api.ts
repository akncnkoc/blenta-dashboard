import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryConfigWithReAuth } from './baseQueryConfig'

export type PromotionCode = {
  id: string
  code: string
  extraTime: string
  alreadyUsed: boolean
}

export const promotionCodeApi = createApi({
  reducerPath: 'promotionCode',
  baseQuery: baseQueryConfigWithReAuth,
  endpoints: (builder) => ({
    getAllPromotionCodes: builder.query<
      {
        data: PromotionCode[]
        meta: { total: number; page: string; size: string; pageCount: string }
      },
      { search?: string; page?: string; size?: string }
    >({
      query: ({ search, page, size }) => ({
        url: `/promotion-code`,
        params: { search, page, size },
      }),
    }),
    createPromotionCode: builder.mutation<
      void,
      { code: string; extraTime: string }
    >({
      query: (body) => ({
        url: '/promotion-code',
        method: 'POST',
        body,
      }),
    }),
    updatePromotionCode: builder.mutation<
      void,
      { id: string; code: string; extraTime: string }
    >({
      query: ({ id, code, extraTime }) => ({
        url: `/promotion-code/${id}`,
        method: 'PUT',
        body: { code, extraTime },
      }),
    }),
    deletePromotionCode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/promotion-code/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetAllPromotionCodesQuery,
  useCreatePromotionCodeMutation,
  useUpdatePromotionCodeMutation,
  useDeletePromotionCodeMutation,
} = promotionCodeApi
