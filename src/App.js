import "@goongmaps/goong-js/dist/goong-js.css";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import router from "./router/routes";
import { getIsBackgound } from "./store/selectors/Selectors";
import jwt from "./utils/jwt";

function App() {
  const navigate = useNavigate();
  const isBackgound = useSelector(getIsBackgound);

  const backgroundStyled = {
    backgroundImage:
      "url(" +
      "https://images-cdn.welcomesoftware.com/Zz03ZTY0Mzk3MDhlNDgxMWViYmRmNWY3MjZjM2QxZTdiZg==" +
      ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };

  return (
    <>
      {!jwt.checkExistToken() ? <Navigate to="/login" replace={true} /> : ""}
      {router.state.location.pathname == "/" && jwt.checkExistToken() ? (
        <Navigate to="Dashboard" replace={true} />
      ) : (
        ""
      )}
      <div className="App" style={isBackgound ? backgroundStyled : {}}>
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
