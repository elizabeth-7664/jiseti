// src/components/shared/Navigations.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button"; // Ensure Button component is imported

export default function Navigations() {
  const { user, isAuthenticated, logout } = useContext(AuthContext); // Re-include 'logout'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 md:px-8 flex justify-between items-center transition-all">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent hover:from-emerald-500 hover:to-teal-400 transition-all duration-200 tracking-tight font-display">
        Jiseti
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Links for unauthenticated users */}
        {!isAuthenticated && (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </>
        )}

        {/* Links for authenticated users */}
        {isAuthenticated && (
          <>
            <Link to="/home">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            {/* Assuming user.is_admin is the correct property for admin check */}
            {user?.is_admin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
            )}
            {/* Re-added Logout button */}
            <Button
              variant="outline" // Using outline variant for logout
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
