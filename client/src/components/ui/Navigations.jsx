// src/components/shared/Navigations.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navigations() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Jiseti</Link>

      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link to="/sign_in" className="text-sm hover:underline">Login</Link>
            <Link to="/sign_up" className="text-sm hover:underline">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="text-sm hover:underline">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
