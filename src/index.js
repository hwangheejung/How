import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RoutineList from "./pages/Routine/RoutineList";
import MyRoutine from "./pages/MyRoutine/MyRoutine";
import LiveList from "./pages/Live/LiveList";
import Calendar from "./pages/Calendar/Calendar";
import RoutineSearch from "./pages/Routine/RoutineSearch";
import MyRoutineSearch from "./pages/MyRoutine/MyRoutineSearch";
import RoutineDetail from "./pages/Routine/RoutineDetail";
import MyRoutineDetail from "./pages/MyRoutine/MyRoutineDetail";
import RoutineStart from "./pages/MyRoutine/RoutineStart";
import MakeLive from "./pages/Live/MakeLive";
import StartScreen from "./pages/MyRoutine/StartScreen";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/",
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
      {
        path: `/start/:id`,
        element: <StartScreen />,
      },
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
