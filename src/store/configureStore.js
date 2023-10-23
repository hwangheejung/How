import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './loginRedux';

export default configureStore({
  reducer: {
    authToken: tokenReducer,
  },
});
