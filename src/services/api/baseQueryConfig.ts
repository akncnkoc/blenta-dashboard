import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { setToken } from '../../redux/slices/userSlice'
import { type RootState } from '../../redux/store' // ✅ only for type is OK

const baseQueryConfig = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5151',
  mode: 'cors',
  timeout: 5000,
  prepareHeaders: (headers, { getState, endpoint, type }) => {
    const token = (getState() as RootState).userSlice.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Accept', 'application/json')

    return headers
  },
})

const baseQueryConfigWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryConfig(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    api.dispatch(setToken(null)) // ✅ no circular import
  }

  return result
}

export { baseQueryConfigWithReAuth }
export default baseQueryConfig
