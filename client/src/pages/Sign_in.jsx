import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sign_in() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      login(res.data);
      navigate("/home");
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = Array.isArray(err.response?.data?.detail)
        ? err.response.data.detail
        : err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-xl bg-gray-100 shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-6">Login to Jiseti</h2>

      {error && (
        <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg mb-4 text-sm text-center">
          {typeof error === "string" ? (
            <p>{error}</p>
          ) : Array.isArray(error) ? (
            error.map((e, i) => <p key={i}>{e.msg || JSON.stringify(e)}</p>)
          ) : (
            <p>{error.detail || "An unknown error occurred"}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-1 font-semibold">Email</label>
        <input
          type="email"
          placeholder="e.g. example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 mb-4 border border-gray-400 rounded-md"
        />

        <label className="mb-1 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-4 border border-gray-400 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-blue-600 mt-2 hover:underline text-center">
    <Link to="/reset-password">Forgot password?</Link>
   </p>


      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/sign_up" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Sign_in;
