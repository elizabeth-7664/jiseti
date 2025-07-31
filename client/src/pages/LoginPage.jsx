// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { login } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.email);
      formData.append("password", form.password);

      const res = await login(formData);
      const { access_token, user } = res.data; // Destructure both from the response

      // --- CRITICAL FIX HERE: Store token and user separately ---
      localStorage.setItem("access_token", access_token); // Store the token string directly
      localStorage.setItem("user", JSON.stringify(user)); // Store the full user object
      // --- END CRITICAL FIX ---

      // --- ADDED CONSOLE LOGS FOR VERIFICATION ---
      console.log("Login API Response - Full data:", res.data);
      console.log("Login API Response - Extracted User Object:", user);
      console.log("Login API Response - Extracted Access Token:", access_token);
      console.log("User object stored in localStorage ('user' key):", localStorage.getItem("user"));
      console.log("Token string stored in localStorage ('access_token' key):", localStorage.getItem("access_token"));

      if (user) {
        console.log("Is user admin?", user.is_admin);
        console.log("User role (if applicable):", user.role);
      }
      

      // Call authLogin to update context state with both the token and the user details
      authLogin({ access_token, user });

      // Conditional navigation logic based on user.is_admin
      if (user && user.is_admin) {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/home"); // Redirect to homepage for regular users
      }

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = Array.isArray(err.response?.data?.detail)
        ? err.response.data.detail
        : err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg text-sm text-center">
            {typeof error === "string" ? (
              <p>{error}</p>
            ) : Array.isArray(error) ? (
              error.map((e, i) => <p key={i}>{e.msg || JSON.stringify(e)}</p>)
            ) : (
              <p>{error.detail || "An unknown error occurred"}</p>
            )}
          </div>
        )}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-sm text-center mt-2">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="underline text-blue-600"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;