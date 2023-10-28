import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './loginRedux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
// import logger from 'redux-logger';
import { PERSIST, PURGE } from 'redux-persist';

const reducers = combineReducers({
  userInfo: userInfoReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userInfo'],
};

const persist_Reducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persist_Reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, PURGE],
      },
    }),
});
