import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-900/10 border border-white/50">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <Shirt className="w-8 h-8 animate-bounce" />
        </div>
      </div>
      <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-2">404</h1>
      <p className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</p>
      <p className="text-slate-500 font-medium text-sm max-w-sm mt-4">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/login"
        className="mt-10 flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <Home className="w-4 h-4" /> Go to Login
      </Link>
    </div>
  );
};

export default NotFound;
