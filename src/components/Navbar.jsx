import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, clearError } from '../redux/slices/authSlice';
import SearchBar from './SearchBar';
import LogoutModal from './LogoutModal';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile } = useSelector((state) => state.user);
  const favoriteCount = profile?.favorites?.length || 0;

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearError());
    toast.success('Logged out successfully');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50">
      <div className="max-w-8xl px-2 sm:px-4 lg:px-6 max-[400px]:h-[50px]">
        <div className="flex flex-nowrap items-center justify-between gap-3 h-auto py-2 max-[400px]:py-1 overflow-x-auto max-[400px]:gap-1">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="text-xl sm:text-xl max-[486px]:text-[16px] max-[360px]:text-[14px] font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap max-[860px]:text-[16px] max-[400px]:mb-3 max-[400px]:14px"
            >
              RecipeApp
            </Link>
          </div>

          {/* Search Bar - Center (always visible, scales dynamically) */}
          <div className="flex-1 min-w-[180px] md:min-w-[300px] lg:min-w-[400px] max-[486px]:w-[155px] max-[486px]:text-[12px] max-w-xl w-full order-3 md:order-2 max-[486px]:h-[50px] max-[400px]:mt-1">
            <SearchBar />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center justify-center w-auto order-3 max-[650px]:mb-4 max-[770px]:mb-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-orange-500 rounded-lg focus:outline-none max-[486px]:p-0 flex items-center justify-center"
            >
             <span className={`w-7 h-7 text-2xl transition-transform duration-300 flex items-center ${
                  isMobileMenuOpen ? 'rotate-360' : ''
                }`}>🍔</span>
  
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center justify-end space-x-3 text-[0.9rem] lg:text-[1rem] order-2 md:order-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `md:px-2 lg:px-3 xl:px-4 md:py-1 lg:py-1.5 xl:py-2 rounded-lg font-medium md:text-xs lg:text-sm xl:text-base transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? 'text-orange-500 bg-orange-100 shadow-md'
                    : 'text-gray-700 hover:text-orange-500 hover:shadow-md'
                }`
              }
            >
              🏠 Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/smart-suggestions"
                  className={({ isActive }) =>
                    `md:px-2 lg:px-3 xl:px-4 md:py-1 lg:py-1.5 xl:py-2 rounded-lg font-medium md:text-xs lg:text-sm xl:text-base transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-purple-500 bg-purple-100 shadow-md'
                        : 'text-gray-700 hover:text-purple-500 hover:shadow-md'
                    }`
                  }
                >
                  ✨ Suggestions
                </NavLink>

                <NavLink
                  to="/meal-planner"
                  className={({ isActive }) =>
                    `md:px-2 lg:px-3 xl:px-4 md:py-1 lg:py-1.5 xl:py-2 rounded-lg font-medium md:text-xs lg:text-sm xl:text-base transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-green-500 bg-green-100 shadow-md'
                        : 'text-gray-700 hover:text-green-500 hover:shadow-md'
                    }`
                  }
                >
                  📅 Planner
                </NavLink>

                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `relative md:px-2 lg:px-3 xl:px-4 md:py-1 lg:py-1.5 xl:py-2 rounded-lg font-medium md:text-xs lg:text-sm xl:text-base transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-pink-500 bg-pink-100 shadow-md'
                        : 'text-gray-700 hover:text-pink-500 hover:shadow-md'
                    }`
                  }
                >
                  ❤️ Favorites
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 md:text-[10px] lg:text-xs">
                      {favoriteCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `md:px-2 lg:px-3 xl:px-4 md:py-1 lg:py-1.5 xl:py-2 rounded-lg font-medium md:text-xs lg:text-sm xl:text-base transition-all duration-300 hover:scale-105 hover:text-red-500 ${
                      isActive
                        ? 'text-indigo-500 bg-indigo-100 shadow-md'
                        : 'text-gray-700 hover:text-indigo-500 hover:shadow-md'
                    }`
                  }
                >
                  👤 Profile
                </NavLink>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-3 py-2 text-red-500 hover:text-red-600 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-blue-500 bg-blue-100 shadow-md'
                        : 'text-gray-700 hover:text-blue-500 hover:shadow-md'
                    }`
                  }
                >
                  🔐 Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-green-500 bg-green-100 shadow-md'
                        : 'text-gray-700 hover:text-green-500 hover:shadow-md'
                    }`
                  }
                >
                  📝 Register
                </NavLink>
              </>
            )}
          </div>

        </div>

        {/* Mobile Nav Links */}
          {isMobileMenuOpen && (
            <div
              className="fixed top-16 right-1 md:hidden bg-white shadow-lg border border-gray-200 rounded-xl px-3 py-2 flex flex-col space-y-2 text-sm z-50 w-fit transition-all duration-300 max-[400px]:top-13"
              style={{ minWidth: "fit-content" }}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md font-medium ${
                    isActive
                      ? 'text-orange-500 bg-orange-100'
                      : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                  }`
                }
              >
                🏠 Home
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-pink-500 bg-pink-100'
                          : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                      }`
                    }
                  >
                    ❤️ Favorites
                    {favoriteCount > 0 && (
                      <span className="ml-1 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                        {favoriteCount}
                      </span>
                    )}
                  </NavLink>

                  <NavLink
                    to="/smart-suggestions"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-purple-500 bg-purple-100'
                          : 'text-gray-700 hover:text-purple-500 hover:bg-purple-50'
                      }`
                    }
                  >
                    ✨ Suggestions
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-indigo-500 bg-indigo-100'
                          : 'text-gray-700 hover:text-indigo-500 hover:bg-indigo-50'
                      }`
                    }
                  >
                    👤 Profile
                  </NavLink>

                  <NavLink
                    to="/meal-planner"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-green-500 bg-green-100 shadow-md'
                          : 'text-gray-700 hover:text-green-500 hover:shadow-md'
                      }`
                    }
                  >
                    📅 Planner
                  </NavLink>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-md font-medium text-left"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-blue-500 bg-blue-100'
                          : 'text-gray-700 hover:text-blue-500 hover:bg-blue-50'
                      }`
                    }
                  >
                    🔐 Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md font-medium ${
                        isActive
                          ? 'text-green-500 bg-green-100'
                          : 'text-gray-700 hover:text-green-500 hover:bg-green-50'
                      }`
                    }
                  >
                    📝 Register
                  </NavLink>
                </>
              )}
            </div>
          )}
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
