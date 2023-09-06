import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import router from "./router/routes";
import jwt from "./utils/jwt";

function App() {
  const navigate = useNavigate();
  return (
    <>
      {!jwt.checkExistToken() ? <Navigate to="/login" replace={true} /> : ""}
      {router.state.location.pathname == "/" && jwt.checkExistToken() ? (
        <Navigate to="Dashboard" replace={true} />
      ) : (
        ""
      )}
      <div className="App">
        <Navbar />
        <p
          style={{
            lineHeight: "70px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Nav
        </p>
        <Outlet />
      </div>
    </>
  );
}

export default App;
