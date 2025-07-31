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
    navigate("/sign_in"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg p-4 md:px-8 flex justify-between items-center rounded-b-lg">
      <Link to="/" className="text-2xl font-bold text-red-700 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors duration-200">
        Jiseti
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Links for unauthenticated users */}
        {!isAuthenticated && (
          <>
            <Link to="/sign_in">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/sign_up">
              <Button size="sm">Register</Button>
            </Link>
          </>
        )}

        {/* Links for authenticated users */}
        {isAuthenticated && (
          <>
            <Link to="/dashboard">
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
