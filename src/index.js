import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import NotFound from './pages/NotFound';
import RoutineList from './pages/Routine/RoutineList';
import MyRoutine from './pages/MyRoutine/MyRoutine';
import LiveList from './pages/Live/LiveList';
import Calendar from './pages/Calendar/Calendar';
import RoutineSearch from './pages/Routine/RoutineSearch';
import MyRoutineSearch from './pages/MyRoutine/MyRoutineSearch';
import RoutineDetail from './pages/Routine/RoutineDetail';
import MyRoutineDetail from './pages/MyRoutine/MyRoutineDetail';
import RoutineStart from './pages/RoutineStart/RoutineStart';
import MakeLive from './pages/Live/MakeLive';
import StartScreen from './pages/RoutineStart/StartScreen';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import Startex from './pages/RoutineStart/Start';
import ReadyTimer from './components/RoutineStart/ReadyTimer';
import LiveSearch from './pages/Live/LiveSearch';
import LiveDetail from './pages/Live/LiveDetail';
import LiveSetting from './pages/Live/LiveSetting';
import OwnerLiveSetting from './pages/Live/OwnerLiveSetting';
import LivePage from './pages/Live/LivePage';
import AddExCalendar from './pages/Calendar/AddExCalendar';

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
      { path: `/calendarinsert`, element: <AddExCalendar /> },
      { path: `/routine/list`, element: <RoutineList /> },
      { path: `/routineSearch`, element: <RoutineSearch /> },
      { path: `/my/routine/list`, element: <MyRoutine /> },
      { path: `/myroutineSearch`, element: <MyRoutineSearch /> },
      { path: `/live/list`, element: <LiveList /> },
      { path: `/liveSearch`, element: <LiveSearch /> },
      { path: '/live/setting/perticipate/:liveId', element: <LiveSetting /> },
      {
        path: '/live/setting/owner/:liveId/:liveTitle',
        element: <OwnerLiveSetting />,
      },
      { path: `/start/:id`, element: <StartScreen /> },
      { path: `/startex/:routid/:id`, element: <Startex /> },
      { path: `/readyTimer/:id`, element: <ReadyTimer /> },
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
    path: `/MakeLive`,
    element: <MakeLive />,
  },
  {
    path: `/livedetail/:routineId/:liveId/:livesubject/:livenick`,
    element: <LiveDetail />,
  },
  {
    path: '/live/realtime/:liveId/:liveTitle/:camera/:audio/:isOwner',
    element: <LivePage />,
  },
  {
    path: `/routinestart/:id`,
    element: <RoutineStart />,
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
