// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext(null); // <--- ADD 'export' HERE, and set default value to null

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const initialUser = localStorage.getItem("user");
  const [user, setUser] = useState(initialUser ? JSON.parse(initialUser) : null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = (loginData) => {
    const { access_token, user: userData } = loginData;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin === true, // Keep this as discussed
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading application...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;