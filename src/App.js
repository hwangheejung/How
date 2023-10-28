import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (!userInfo.nickname) navigate("/login");
  }, []);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
