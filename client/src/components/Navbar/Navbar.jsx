import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-white rounded-2xl border-b-2 border-white my-2 sm:my-0 bg-[##658864] py-2 px-4 transition duration-300 transform hover:scale-105 hover:shadow-lg" // Added padding, background color, hover effect, and shadow
      : "text-white border-b-2 border-transparent hover:bg-[#0085ff] hover:rounded-2xl my-2 py-2 px-4 transition duration-300 transform hover:scale-105 hover:shadow-md"; // Added padding, hover effect, and shadow

  return (
    <nav className="text-2xl fixed top-0 left-0 h-[90%]   mt-10 pb-4">
      <div className="container flex flex-col p-6 mx-auto text-white capitalize dark:text-gray-300">
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
          settlements
        </Link>

        {currentUser ? (
          <Link to="/" className="mt-auto">
            <img
              src={currentUser._doc.profilePicture} // Assuming user object has a profileImage property
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        ) : (
          <div className="flex flex-col space-y-4 mt-auto">
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
    </nav>
  );
};

export default Navbar;
