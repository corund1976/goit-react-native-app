import { createSlice } from '@reduxjs/toolkit';

const initState = {
  userId: null,
  userAvatar: null,
  userName: null,
  userEmail: null,
  authStatus: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.id,
      userAvatar: payload.avatar,
      userName: payload.name,
      userEmail: payload.email,
    }),
    updateUserAvatar: (state, { payload }) => ({
      ...state,
      userAvatar: payload.avatar,
    }),
    changeAuthStatus: (state, { payload }) => ({
      ...state,
      authStatus: payload.authStatus,
    }),
    signOutUser: () => initState,
  },
});