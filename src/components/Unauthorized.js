import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
