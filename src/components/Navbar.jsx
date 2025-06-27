// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiHome, FiHeart, FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-700 shadow-lg" : "bg-blue-600"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/dashboard"
              className="text-xl font-bold tracking-tight hover:text-blue-100 transition-colors"
            >
              श्री राम गंज बाजार गणेश उत्सव मंडल
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="flex items-center hover:text-blue-100 transition-colors"
            >
              <FiHome className="mr-2" />
              Dashboard
            </Link>

            <Link
              to="/donate"
              className="flex items-center hover:text-blue-100 transition-colors"
            >
              <FiHeart className="mr-2" />
              Donate
            </Link>

            {/* ✅ Admin-only link */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center hover:text-blue-100 transition-colors"
              >
                <FiUser className="mr-2" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3">
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiHome className="mr-3" />
            Dashboard
          </Link>

          <Link
            to="/donate"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiHeart className="mr-3" />
            Donate
          </Link>

          {/* ✅ Admin-only link in mobile menu */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FiUser className="mr-3" />
              Admin Panel
            </Link>
          )}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
