import { configureStore } from '@reduxjs/toolkit';
// import tokenReducer from './loginRedux';
import userInfoReducer from './loginRedux';

export const store = configureStore({
  reducer: {
    // authToken: tokenReducer,
    userInfo: userInfoReducer,
  },
});
