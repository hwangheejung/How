import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    nickname: '',
  },
  reducers: {
    SET_USERINFO: (state, action) => {
      state.nickname = action.payload.nick;
    },
    DELETE_USERINFO: (state) => {
      state.nickname = '';
    },
  },
});

export const { SET_USERINFO, DELETE_USERINFO } = userInfoSlice.actions;
export default userInfoSlice.reducer;
