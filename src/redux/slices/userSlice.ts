import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type IUserState = {
  token?: string | null
  refresh_token?: string | null
  isAuthenticated: boolean
}

const initialState: IUserState = {
  token: (localStorage && localStorage.getItem('token')) ?? '',
  refresh_token: '',
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logout: () => initialState,
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
      if (localStorage && action.payload) {
        localStorage.setItem('token', action.payload)
      }
      if (localStorage && action.payload == null) {
        localStorage.removeItem('token')
      }
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refresh_token = action.payload
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
  },
})
export const { setToken, setRefreshToken, logout } = userSlice.actions

export default userSlice.reducer
