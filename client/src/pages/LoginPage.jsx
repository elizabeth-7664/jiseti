// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner"; // Added for loading state
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
      const { access_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login API Response - Full data:", res.data);
      console.log("Login API Response - Extracted User Object:", user);
      console.log("Login API Response - Extracted Access Token:", access_token);
      console.log("User object stored in localStorage ('user' key):", localStorage.getItem("user"));
      console.log("Token string stored in localStorage ('access_token' key):", localStorage.getItem("access_token"));

      if (user) {
        console.log("Is user admin?", user.is_admin);
        console.log("User role (if applicable):", user.role);
      }

      authLogin({ access_token, user });

      if (user && user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/home");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 animate-fadeIn"
        aria-label="Login to your account"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight font-serif">
          Sign In
        </h2>

        {error && (
          <div
            className="text-red-600 dark:text-red-400 text-sm mb-6 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg"
            role="alert"
          >
            {typeof error === "string" ? (
              <p>{error}</p>
            ) : Array.isArray(error) ? (
              error.map((e, i) => <p key={i}>{e.msg || JSON.stringify(e)}</p>)
            ) : (
              <p>{error.detail || "An unknown error occurred"}</p>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
              aria-required="true"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-8 px-10 py-3.5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          size="lg"
        >
          {loading ? <Spinner className="h-5 w-5 mx-auto" /> : "Sign In"}
        </Button>

        <div className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            aria-label="Navigate to forgot password page"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/sign_up"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            aria-label="Navigate to sign up page"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;