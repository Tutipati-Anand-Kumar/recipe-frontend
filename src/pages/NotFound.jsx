import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;