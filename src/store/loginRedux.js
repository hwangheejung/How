import { createSlice } from '@reduxjs/toolkit';

export const tokenSlice = createSlice({
  name: 'authToken',
  initialState: {
    nickname: '',
    authenticated: false,
    accessToken: null,
    expireTime: null,
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      state.nickname = action.payload.nickname;
      state.authenticated = true;
      state.accessToken = action.payload.token;
      state.expireTime = new Date().getTime() + 600 * 1000;
    },
    DELETE_TOKEN: (state) => {
      (state.nickname = ''), (state.authenticated = false);
      state.accessToken = null;
      state.expireTime = null;
    },
  },
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;
export default tokenSlice.reducer;
