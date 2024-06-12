import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-white dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
      : "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6";

  return (
    <nav className="bg-white text-2xl   flex dark:bg-gray-800 fixed top-0 left-0 w-full">
      <div className="container flex items-center justify-center p-6 mx-auto text-white capitalize dark:text-gray-300">
        <Link to="/" className={getLinkClass("/")}>
          home
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
    </nav>
  );
};

export default Navbar;
