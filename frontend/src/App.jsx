import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";
import ProtectRoute from "./components/ProtectRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path={"/auth"} element={<Auth />} />

        <Route element={<ProtectRoute />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/profile"} element={<Profile />} />
        </Route>

        <Route />
      </Routes>
    </>
  );
}

export default App;
