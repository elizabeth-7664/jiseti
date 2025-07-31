// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { register } from "../utils/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Registration failed."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 animate-fadeIn"
        aria-label="Register for an account"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight font-serif">
          Create Your Account
        </h2>
        {error && (
          <div
            className="text-red-600 dark:text-red-400 text-sm mb-6 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
              aria-required="true"
            />
          </div>
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
          className="w-full mt-8 px-10 py-3.5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          size="lg"
        >
          Register
        </Button>
        <div className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            aria-label="Navigate to login page"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;