import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import { userApi } from '../services/api/user-api'
import { rootReducer } from './rootReducer'
import storage from './storage'
import { categoryApi } from '@/services/api/category-api'
import { tagApi } from '@/services/api/tag-api'
import { questionApi } from '@/services/api/question-api'
import { promotionCodeApi } from '@/services/api/promotion-code-api'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [],
  whitelist: [],
}

const persistedReducer = persistReducer<typeof store.getState>(
  persistConfig,
  rootReducer,
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: true,
    })
      .concat(userApi.middleware)
      .concat(categoryApi.middleware)
      .concat(tagApi.middleware)
      .concat(promotionCodeApi.middleware)
      .concat(questionApi.middleware),
})

const persistor = persistStore(store)
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export { persistor, store }
export const { dispatch: storeDispatch } = store
