import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../Component/auth.jsx';
import { useTheme } from './ThemeContext.jsx'; // Import Theme Hook
import { Moon, Sun } from 'lucide-react'; // Optional icons

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">JobPortal</Link>

        <div className="flex items-center space-x-6">
          <NavLink to="/jobs" className={({ isActive }) =>
            isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
          }>
            Jobs
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
              }>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) =>
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
              }>
                Profile
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/post-job" className={({ isActive }) =>
                  isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
                }>
                  Post Job
                </NavLink>
              )}
              <button
                onClick={logout}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) =>
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
              }>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) =>
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-300'
              }>
                Register
              </NavLink>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="focus:outline-none text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
