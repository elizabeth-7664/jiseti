// src/pages/Sign_up.jsx
import React, { useState } from "react";
import "./Sign_up.css";
import { register } from "../utils/api"; // Corrected import
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Optional, if login is needed later

function Sign_up() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { login: authLogin } = useAuth(); // Remove if not logging in here

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await register({ username, email, password });
      // Redirect to verification page instead of logging in
      navigate("/verify-email", {
        state: { message: "Please check your email to verify your account." },
      });
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.status === 400) {
        setError("Registration failed. Email or username may already exist.");
      } else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Create an account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>Username</label>
        <input
          type="text"
          placeholder="e.g. matrix_label"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Re-Enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="redirect-text">
        Already have an account? <Link to="/sign_in">Sign In</Link>
      </p>
    </div>
  );
}

export default Sign_up;