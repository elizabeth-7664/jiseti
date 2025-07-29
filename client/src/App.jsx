// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { fetchCurrentUser } from "./utils/api";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/Sign_in";
import SignUp from "./pages/Sign_up";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isLoading: false,
});

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let token = null;
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      token = userData?.access_token;
    } catch (err) {
      console.error("Error parsing localStorage user data", err);
    }

    if (token) {
      fetchCurrentUser()
        .then((res) => {
          setUser(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching current user", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("user");
          }
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthProvider>
      <AuthContext.Provider value={{ user, setUser, isLoading }}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign_in" element={<SignIn />} />
            <Route path="/sign_up" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/home"
              element={user ? <Dashboard /> : <Navigate to="/sign_in" replace />}
            />
            <Route
              path="/admin"
              element={user ? <AdminDashboard /> : <Navigate to="/sign_in" replace />}
            />
            <Route
              path="/user"
              element={user ? <UserDashboard user={user} /> : <Navigate to="/sign_in" replace />}
            />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </AuthProvider>
  );
}

export default App;