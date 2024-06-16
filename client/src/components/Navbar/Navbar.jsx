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
  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-white rounded-xl border-b-2 border-white my-2  duration-300 transform hover:scale-105 hover:shadow-lg  cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]" // Added padding, background color, hover effect, and shadow
      : "text-gray-400 border-b-2 border-transparent hover:scale-105  hover:rounded-2xl my-2 py-2 px-4 transition duration-300 transform hover:scale-105 hover:shadow-md"; // Added padding, hover effect, and shadow

  const handleLogout = async () => {
    try {
      await apiRequest().post("/auth/logout");
      // updateUser(null);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.log(error.message);
      toast.error("Could not log out");
    }
  };
  return (
    <nav className="text-2xl fixed   top-0 left-0 h-[90%] mt-10 pb-4 ">
      <div className="gap-5   flex flex-col p-6 mx-auto  text-white capitalize dark:text-gray-300">
        {currentUser ? (
          <Link
            to="/"
            className="mb-4 flex items-center justify-around border border-white p-2 rounded-xl"
          >
            <img
              src={currentUser._doc.profilePicture} // Assuming user object has a profileImage property
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <p>{currentUser._doc.username}</p>
          </Link>
        ) : (
          <div className="mb-4 flex items-center justify-around">
            {/* <Link
              to="/login"
              className="text-blue-500 hover:text-blue-700 transition duration-200"
            >
              Login
            </Link> */}
            <Link
              to="/register"
              className="w-full text-blue-500 hover:text-blue-700 transition duration-200"
            >
              Signup
            </Link>
          </div>
        )}

        <Link to="/" className={getLinkClass("/")}>
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
            className="mt-20 bg-red-500 rounded-xl p-4 text-white  transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
