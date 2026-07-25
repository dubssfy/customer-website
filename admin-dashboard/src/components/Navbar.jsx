import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30 lg:pl-10">
      <div className="flex items-center gap-4">
        {/* Mobile Spacer if Sidebar toggler is absolute - just leave padding */}
        <div className="lg:hidden w-8" />
        
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{title || 'Dashboard'}</h1>
          <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-blue-500" />
            {today}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-blue-200 transition-all relative group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm border border-blue-200">
              {user?.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.full_name}</p>
              <p className="text-xs font-semibold text-blue-600 capitalize">{user?.role}</p>
            </div>
            <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-bold text-slate-800">{user?.full_name}</p>
                  <p className="text-xs font-semibold text-blue-600 capitalize">{user?.role}</p>
                </div>
                
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </div>
                
                <div className="py-1 border-t border-slate-100">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
