import { combineReducers } from 'redux'
import userSlice from './slices/userSlice'
import { userApi } from '../services/api/user-api'
import { categoryApi } from '../services/api/category-api'
import { tagApi } from '@/services/api/tag-api'

export const rootReducer = combineReducers({
  userSlice,
  [userApi.reducerPath]: userApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [tagApi.reducerPath]: tagApi.reducer,
})
