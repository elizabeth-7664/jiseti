import React, { useState } from "react";
import  Input  from "../components/ui/Input";
import  Button  from "../components/ui/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Trigger password reset email
    console.log("Sending reset email to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold">Forgot Password</h2>
        <p className="text-sm text-gray-600">We’ll send you a link to reset your password.</p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button className="w-full" type="submit">Send Reset Link</Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
