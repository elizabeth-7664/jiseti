import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { resetPassword } from "../utils/api";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Reset token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword({ token, password });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to reset password."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold">Reset Password</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button className="w-full" type="submit">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
