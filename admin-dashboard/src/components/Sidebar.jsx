import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Tag, LogOut, Menu, X, ChevronRight, Shirt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/prices', label: 'Price List', icon: Tag },
];

const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isAdmin ? adminLinks : managerLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-indigo-500/20 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0 p-1.5 backdrop-blur-md border border-white/10">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <p className="font-black text-white text-lg tracking-tight">Swaccham</p>
              <p className="text-blue-200 text-xs font-medium tracking-wider uppercase">Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm border border-blue-300/30">
              {user?.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.full_name}</p>
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className={`flex-1 px-3 space-y-1.5 ${collapsed ? 'py-6' : ''}`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-white text-blue-700 shadow-lg font-bold'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white font-semibold'
              } ${collapsed ? 'justify-center' : ''}`
            }
            onClick={() => setMobileOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="text-sm"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-300 font-bold transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col bg-slate-900 bg-gradient-to-b from-slate-900 to-blue-900 h-screen sticky top-0 overflow-hidden flex-shrink-0 border-r border-slate-800"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 right-[-12px] z-20 w-6 h-6 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors shadow-md border-2 border-slate-900 cursor-pointer"
        >
          <ChevronRight className={`w-3 h-3 text-white transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-slate-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/10"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-gradient-to-b from-slate-900 to-blue-900 z-50 overflow-y-auto shadow-2xl border-r border-white/10"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-blue-200 hover:text-white bg-white/5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
