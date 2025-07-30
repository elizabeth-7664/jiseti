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
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold">Register</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Input name="username" placeholder="Username" onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <Button className="w-full" type="submit">Register</Button>
        <div className="text-sm text-center mt-2">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="underline text-blue-600">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
