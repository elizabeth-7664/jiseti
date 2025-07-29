import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  Input  from "../components/ui/Input";
import  Button  from "../components/ui/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Replace with real API call
    console.log("Logging in with:", form);
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold">Login</h2>
        <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <Button className="w-full" type="submit">Login</Button>
        <div className="text-sm text-center mt-2">
          <button onClick={() => navigate("/forgot-password")} className="underline text-blue-600">
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
