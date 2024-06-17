import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "./home.css"; // Import the CSS file for the background styles

const Home = () => {
  return (
    <div className="container">
      <div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Welcome to MyWebsite!
        </h1>
        <p className="text-white text-lg md:text-xl text-center mb-8">
          MyWebsite is a personal project created with love and dedication,
          designed specifically to streamline borrower management. Whether
          you're a small business owner, a freelancer, or managing personal
          finances, MyWebsite offers powerful tools to simplify and optimize
          your borrowing process.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/register"
            className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition duration-300 mb-4 md:mb-0"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
