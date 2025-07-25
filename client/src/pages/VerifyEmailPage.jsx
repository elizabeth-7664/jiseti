import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      setStatus("error");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage(res.data.msg || "✅ Email verified successfully.");
        setStatus("success");
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.detail ||
            "❌ Verification failed. Token may be invalid or expired."
        );
        setStatus("error");
      });
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate("/sign_in");
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="p-6 rounded-lg shadow-md bg-white max-w-md w-full text-center">
        {status === "loading" ? (
          <div>
            <div className="animate-pulse text-gray-600 mb-2">Verifying...</div>
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            <h2
              className={`text-xl font-semibold mb-3 ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status === "success" ? "✅ Email Verified" : "❌ Verification Failed"}
            </h2>
            <p className="mb-4 text-gray-700">{message}</p>
            {status === "success" && (
              <button
                onClick={() => navigate("/sign_in")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Go to Sign In
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
