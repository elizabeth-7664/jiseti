import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sign_up() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
        }
      );

      alert("Signup successful! Check your email to verify your account.");
      navigate("/sign_in");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. matrix_label"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. example@gmail.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Re-enter password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/sign_in" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
