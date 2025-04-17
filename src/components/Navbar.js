import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600">LifeSync</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Home</Link>
              <Link to="/fitness" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Fitness</Link>
              <Link to="/nutrition" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Nutrition</Link>
              <Link to="/posture-check" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Posture Check</Link>
              <Link to="/tracker" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Tracker</Link>
              <Link to="/community" className="text-gray-900 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition-colors">Community</Link>
            </div>
          </div>

          {/* Desktop Profile Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 text-gray-900 hover:text-emerald-600 px-4 py-2 rounded-lg transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover border-2 border-emerald-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=059669&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-semibold">
                      {(user.displayName || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium">{user.displayName || user.email.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Manage Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-900 hover:text-emerald-600 px-4 py-2 rounded-lg font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Home</Link>
          <Link to="/fitness" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Fitness</Link>
          <Link to="/nutrition" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Nutrition</Link>
          <Link to="/posture-check" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Posture Check</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">About Us</Link>
          <Link to="/tracker" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Tracker</Link>
          <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Community</Link>
          
          {user ? (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=059669&color=fff`;
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-800">{user.displayName || user.email.split('@')[0]}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Manage Profile</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-emerald-600 hover:bg-gray-50">Login</Link>
              <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700">Sign Up</Link>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;