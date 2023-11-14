import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import RoutineList from './pages/Routine/RoutineList';
import MyRoutine from './pages/MyRoutine/MyRoutine';
import LiveList from './pages/Live/LiveList';
import Calendar from './pages/Calendar/Calendar';
import RoutineSearch from './pages/Routine/RoutineSearch';
import MyRoutineSearch from './pages/MyRoutine/MyRoutineSearch';
import RoutineDetail from './pages/Routine/RoutineDetail';
import MyRoutineDetail from './pages/MyRoutine/MyRoutineDetail';
import RoutineStart from './pages/MyRoutine/RoutineStart';
import MakeLive from './pages/Live/MakeLive';
import StartScreen from './pages/MyRoutine/StartScreen';
import LivePage from './pages/Live/LivePage';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import Startex from './pages/MyRoutine/Start';
import ReadyTimer from './pages/Exercise/ReadyTimer';
import LiveSearch from './pages/Live/LiveSearch';
import LiveDetail from './pages/Live/LiveDetail';
import LiveSetting from './pages/Live/LiveSetting';
import OwnerLiveSetting from './pages/Live/OwnerLiveSetting';

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
      { path: `/routineSearch`, element: <RoutineSearch /> },
      { path: `/myroutineSearch`, element: <MyRoutineSearch /> },
      { path: `/liveSearch`, element: <LiveSearch /> },
      { path: `/start/:id`, element: <StartScreen /> },
      { path: `/startex/:id`, element: <Startex /> },
      { path: `/readyTimer/:id`, element: <ReadyTimer /> },
      { path: '/live/setting/perticipate/:liveId', element: <LiveSetting /> },
      { path: '/live/setting/owner/:liveId', element: <OwnerLiveSetting /> },
    ],
  },
  {
    path: `/routinedetail/:id`,
    element: <RoutineDetail />,
  },
  {
    path: `/myroutindetail/:id`,
    element: <MyRoutineDetail />,
  },
  {
    path: `/routinestart/:id`,
    element: <RoutineStart />,
  },
  {
    path: `/MakeLive`,
    element: <MakeLive />,
  },
  {
    path: `/livedetail/:routineId/:liveId/:livesubject/:livenick`,
    element: <LiveDetail />,
  },
  {
    path: '/live/realtime/:liveId/:camera/:audio/:isOwner',
    element: <LivePage />,
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
