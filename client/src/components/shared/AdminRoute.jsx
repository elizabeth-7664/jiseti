// src/components/shared/AdminRoute.jsx (WITH LOADING CHECK)
import React from "react";
import { Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../../hooks/useAuth";
import Loader from './Loader'; // Assuming you have a Loader component

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get 'loading' state as well
  const location = useLocation(); // To store current path for redirection after login

  // 1. Show loader while authentication status is being determined
  if (loading) {
    return <Loader />; // Or a simple <div>Loading...</div>
  }

  // 2. If user is not logged in, redirect to login
  if (!user) {
    // Pass state to redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If user is logged in but not an admin, redirect to unauthorized/homepage
  //    Assuming your backend user object has an 'is_admin' boolean
  if (!user.is_admin) {
    return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page (recommended)
    // Or: return <Navigate to="/" replace />; // Redirect to homepage
  }

  // 4. If all checks pass, render the children (the protected admin component)
  return children;
};

export default AdminRoute;