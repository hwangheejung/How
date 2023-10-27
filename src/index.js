import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import RoutineList from './pages/RoutineList';
import MyRoutine from './pages/MyRoutine';
import LiveList from './pages/LiveList';
import Calendar from './pages/Calendar';
import RealtimeLive from './pages/RealtimeLive';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Calendar /> },
      { path: `/calendar`, element: <Calendar /> },
      { path: `/routine/list`, element: <RoutineList /> },
      { path: `/my/routine/list`, element: <MyRoutine /> },
      { path: `/live/list`, element: <LiveList /> },
      { path: `/live/realtime`, element: <RealtimeLive /> },
    ],
  },
]);

export const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
