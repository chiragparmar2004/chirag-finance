import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "./home.css"; // Import the CSS file for the background styles

const Home = () => {
  return (
    <div className=" h-[100%] mx-auto px-6 py-12 md:py-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg">
          Welcome to Chirag Finance!
        </h1>
        <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Chirag Finance is a personal project created with love and dedication,
          designed specifically to streamline borrower management. Whether
          you're a small business owner, a freelancer, or managing personal
          finances, Chirag Finance offers powerful tools to simplify and
          optimize your borrowing process.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-green-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-green-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
