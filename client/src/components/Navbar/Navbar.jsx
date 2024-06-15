import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-white dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
      : "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6";

  return (
    <nav className="bg-white text-2xl flex dark:bg-gray-800 fixed top-0 left-0 w-full">
      <div className="container flex items-center justify-between p-6 mx-auto text-white capitalize dark:text-gray-300">
        <div className="flex">
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
        </div>
        <div className="flex items-center">
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser._doc.profilePicture} // Assuming user object has a profileImage property
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </Link>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-700 transition duration-200"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
