// src/pages/Sign_in.jsx
import React, { useState } from "react";
import "./Sign_in.css";
import { login } from "../utils/api"; // Corrected import
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sign_in() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await login(formData);
      const { access_token, user } = res.data;
      localStorage.setItem("user", JSON.stringify({ access_token }));
      authLogin({ access_token, user });
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
    <div className="container">
      <h2>Login to Jiseti</h2>
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
      <form onSubmit={handleSubmit} className="form">
        <label>Email</label>
        <input
          type="email"
          placeholder="e.g. example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="redirect-text">
        Don't have an account? <Link to="/sign_up">Sign Up</Link>
      </p>
    </div>
  );
}

export default Sign_in;