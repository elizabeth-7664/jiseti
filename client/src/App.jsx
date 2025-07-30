import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import AuthRoutes from "./routes/AuthRoutes";
import InApp from "./routes/InApp";
import Toast from "./components/ui/Toast";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <ThemeProvider>
      {user ? <InApp /> : <AuthRoutes />}
      <Toast />
    </ThemeProvider>
  );
};

export default App;
