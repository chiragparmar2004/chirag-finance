import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Layout.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedLayout = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="main-container ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
export { ProtectedLayout };
