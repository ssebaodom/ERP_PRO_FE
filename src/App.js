import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { useNavigate,Navigate } from "react-router-dom";
import jwt from "./utils/jwt";
import { useState } from "react";
import router from "./router/routes";
import Footer from "./components/Footer/Footer";


function App() {
  const navigate = useNavigate();
  return (
    <>
    {!jwt.checkExistToken()? <Navigate to="/login" replace={true} />:''}
    {router.state.location.pathname == '/' &&jwt.checkExistToken()? <Navigate to="todo" replace={true} />:''}
    <div className="App">
      <Navbar />
      <p style={{ lineHeight: "70px",pointerEvents:'none',userSelect:'none' }}>Nav</p>
      <Outlet />
    </div>
    </>
  );
}

export default App;
