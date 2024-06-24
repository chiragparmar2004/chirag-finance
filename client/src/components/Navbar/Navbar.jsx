import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const paths = [
    "/",
    "/Add_Loan",
    "/Add_Member",
    "/Dashboard",
    "/payments",
    "/settlements",
  ];
  const getLinkClass = (path) => {
    if (
      location.pathname === path ||
      (!paths.includes(location.pathname) && path === "/home_page")
    ) {
      return "text-white bg-blue-500 border-blue-600 border-b-[4px] my-2 py-2 px-4 rounded-lg transition transform hover:scale-105 hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]";
    }
    return "text-gray-400 border-transparent my-2 py-2 px-4 transition transform hover:scale-105 hover:shadow-md hover:text-gray-600";
  };

  const handleLogout = async () => {
    try {
      await apiRequest().post("/auth/logout");
      localStorage.removeItem("user");
      updateUser(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error.message);
      toast.error("Could not log out");
    }
  };

  return (
    <nav className="fixed w-64 h-full bg-[#1d1c1c] text-white p-6">
      <div className="flex flex-col gap-2">
        {currentUser ? (
          <Link
            to="/"
            className="flex items-center justify-self-start text-2xl gap-4 p-2 rounded-lg border border-white"
          >
            <img
              src={currentUser._doc.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <p>{currentUser._doc.username}</p>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/register"
              className="w-full text-center text-blue-500 hover:text-blue-700 transition"
            >
              Signup
            </Link>
          </div>
        )}

        <Link to="/home_page" className={getLinkClass("/home_page")}>
          Home
        </Link>
        <Link to="/Add_Loan" className={getLinkClass("/Add_Loan")}>
          Add Loan
        </Link>
        <Link to="/Add_Member" className={getLinkClass("/Add_Member")}>
          Add Member
        </Link>
        <Link to="/Dashboard" className={getLinkClass("/Dashboard")}>
          Dashboard
        </Link>
        <Link to="/payments" className={getLinkClass("/payments")}>
          Payments
        </Link>
        <Link to="/settlements" className={getLinkClass("/settlements")}>
          Settlements
        </Link>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="mt-8 bg-red-500 p-4 rounded-lg transition duration-200 hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
